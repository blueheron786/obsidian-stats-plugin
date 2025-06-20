import { Plugin } from "obsidian";

export default class ShowStatsPlugin extends Plugin {
  async onload() {
    // Expose global async function on window
    (window as any).showStats = async () => {
      const files = this.app.vault.getMarkdownFiles();
      const metaCache = this.app.metadataCache;

      const totalNotes = files.length;

      let totalWords = 0;
      for (const file of files) {
        const content = await this.app.vault.read(file);
        totalWords += content.split(/\s+/).filter(Boolean).length;
      }

      let totalLinks = 0;
      for (const file of files) {
        const cache = metaCache.getFileCache(file);
        if (cache?.links) totalLinks += cache.links.length;
      }
      const avgLinks = totalNotes > 0 ? (totalLinks / totalNotes).toFixed(1) : "0";

      const tagSet = new Set<string>();
      let totalTagUsages = 0;
      for (const file of files) {
        const cache = metaCache.getFileCache(file);
        if (cache?.tags) {
          for (const tag of cache.tags) {
            tagSet.add(tag.tag);
            totalTagUsages++;
          }
        }
      }
      const totalUniqueTags = tagSet.size;
      const tagsPerNote = totalNotes > 0 ? (totalTagUsages / totalNotes).toFixed(1) : "0";

      // Expose global async function to show last modified notes
      (window as any).showLastModifiedNotes = this.showLastModifiedNotes.bind(this);

      return `
📄 **Total Notes:** ${totalNotes}  
✍️ **Total Words:** ${totalWords.toLocaleString()}  
🔗 **Total Links (outgoing):** ${totalLinks}  
🧠 **Average Links per Note:** ${avgLinks}  
🏷️ **Unique Tags:** ${totalUniqueTags}  
📌 **Total Tag Usages:** ${totalTagUsages}  
🧩 **Tags per Note:** ${tagsPerNote}
      `.trim();
    };
  }

  onunload() {
    delete (window as any).showStats;
  }

  async showLastModifiedNotes(numItems = 10, excludeFolder = "Templates"): Promise<string> {
    const files = this.app.vault.getMarkdownFiles()
      .filter(file => !file.path.startsWith(excludeFolder + "/"));

    const sorted = files
      .sort((a, b) => b.stat.mtime - a.stat.mtime)
      .slice(0, numItems);

    const lines = sorted.map(f =>
      `- [[${f.basename}]] (Last modified: ${new Date(f.stat.mtime).toLocaleDateString()})`
    );

    return lines.join("\n");
  }
}

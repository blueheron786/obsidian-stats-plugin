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
}

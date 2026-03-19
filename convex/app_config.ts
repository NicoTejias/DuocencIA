import { query } from "./_generated/server";

export const getLatestConfig = query({
  args: {},
  handler: async (_ctx) => {
    try {
      // En el futuro esto podría venir de una tabla 'config'
      return {
        latestVersion: "1.0.12",
        downloadUrl: "https://github.com/NicoTejias/QuestIA/releases/download/v.1.0.12/QuestIA.1.0.12.apk", 
        isMandatory: true,
        message: "Versión 1.0.12: Optimizaciones de sistema y correcciones menores."
      };
    } catch (error) {
      console.error("Error in getLatestConfig:", error);
      return null;
    }
  },
});

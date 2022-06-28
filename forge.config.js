module.exports = {
    packagerConfig: {
        icon: "dist/assets/icons/favicon",
        // all: true,
        executableName: "Tesla Eyes",
        name: "Tesla Eyes"
    },
    makers: [
        {
            name: "@electron-forge/maker-zip",
            platforms: ["darwin", "mas", "win32", "linux"],
        }
    ],
};

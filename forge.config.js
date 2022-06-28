module.exports = {
    packagerConfig: {
        icon: "dist/assets/icons/favicon",
        // all: true,
        executableName: "Tesla Eyes",
        name: "Tesla Eyes"
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "Tesla Eyes",
            },
        },
        {
            name: "@electron-forge/maker-zip",
            config: {
                name: "Tesla Eyes",
            },
            platforms: ["darwin", "mas", "win32", "linux"],
        },
        {
            name: "@electron-forge/maker-deb",
            config: {},
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {},
        },
    ],
};

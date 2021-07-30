const fs = require('fs');

class FileHelper {
    constructor() {
        this.fs = fs;
    }

    writeDataToFileSync = (data, filePath) => {
        this.fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
    };

    writeDataToFileAsync = (data, filePath) => {
        this.fs.writeFile(filePath, JSON.stringify(data), 'utf8', () => {});
    };
}

const fileHelper = new FileHelper();
module.exports = fileHelper;
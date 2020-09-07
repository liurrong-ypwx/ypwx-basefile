const UtilScreen = {
    getDocElFontSize() {
        let docEl = document.documentElement as any;
        let fontsize = 0;
        let desigWidth = 1920;
        let clientWidth = docEl.clientWidth;
        let calFactor = 100;


        if (clientWidth) {
            fontsize = calFactor * (clientWidth / desigWidth);
        }

        return fontsize;
    }
}

export default UtilScreen;
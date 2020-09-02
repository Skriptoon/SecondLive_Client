var open_inv;
var inv_browser;
mp.keys.bind(0x49, true, () => {
    if(open_inv) { 
        inv_browser.destroy;
        open_inv = false;
    } else {
        inv_browser = mp.browsers.new("package://ui/index.html");
        open_inv = true;
    }
})
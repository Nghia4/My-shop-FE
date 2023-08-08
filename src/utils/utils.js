import {parseISO, format } from 'date-fns'

export const isJsonString = (data) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false
    }
    return true
} 

export const getBase64 = (file) => 
new Promise ((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
})

export function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  export const renderOptions = (arr) => {
    let results = []
    if (arr) {
        results = arr?.map((option) => {
            return {
                value: option,
                label: option
            }
        })
    }
    results.push({
        label:'Them type',
        value:'add-type'
    })
    return results
  }

  export const convertPrice = (price) => {
    try {
        const result = price?.toLocaleString().replaceAll(',', '.')
        return `${result} VND`
    } catch (error) {
        return null
    }
  }

  export const formatDay = (dateString) => {
    try {
        const date = parseISO(dateString)
        return format(date, "'Ngày' dd 'tháng' MM 'năm' yyyy, HH:mm:ss")
    } catch (error) {
        return null
    }
  }

  export const initFaceBookSDK = () => {
    if(window.FB) {
        window.FB.XFBML.parse()
    }
    let locale = "vi_VN";
    window.fbAsyncInit = function () {
        window.FB.init({
            appID: process.env.REACT_PLUGIN_FB_ID,
            cookie: true,
            xfbml: true,
            version: "v2.1"
        })
    };
    (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = `//connect.facebook.net/${locale}/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
  }
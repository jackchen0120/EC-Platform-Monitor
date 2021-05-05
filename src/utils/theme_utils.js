const theme = {
  dark: {
    // 背景颜色
    backgroundColor: '#3f3f46',
    // 图表背景色
    bgColor: '#100c2a',
    // label文字颜色
    labelColor: '#fff',
    // 标题的文字颜色
    titleColor: '#fff',
    // 左上角logo的图标路径
    logoSrc: 'logo_dark.png',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_dark.png',
    // 页面顶部的边框图片
    headerBorderSrc: 'header_border_dark.png'

  },
  default: {
    // 背景颜色
    backgroundColor: '#eee',
    // 图表背景色
    bgColor: '#fff',
    // label文字颜色
    labelColor: '#100c2a',
    // 标题的文字颜色
    titleColor: '#000',
    // 左上角logo的图标路径
    logoSrc: 'logo_light.png',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_light.png',
    // 页面顶部的边框图片
    headerBorderSrc: 'header_border_light.png'
  }
}

export function getThemeValue (themeName) {
  return theme[themeName]
}

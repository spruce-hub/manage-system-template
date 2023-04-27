import { GlobalThemeOverrides } from 'naive-ui'
const themes: GlobalThemeOverrides = {
  common: {
    borderRadius: '2px',
    borderColor: '#DDDDDDFF',
    errorColor: '#d03050',
    errorColorHover: '#f17e44FF',
    errorColorPressed: '#f17e44FF',
    errorColorSuppl: '#EA5703FF',
    fontWeightStrong: '600',
    heightMedium: '34px',
    primaryColor: '#EA5703FF',
    primaryColorHover: '#f17e44FF',
    primaryColorPressed: '#f17e44FF',
    primaryColorSuppl: '#EA5703FF',
    textColor1: '#333333FF',
    textColor2: '#333333FF'
  },
  Avatar: {
    heightSmall: '60px'
  },
  Badge: {
    color: '#EA5703'
  },
  Button: {
    // type warning
    borderDisabledWarning: '1px solid #dddddd',
    borderFocusWarning: '1px solid #f17e44',
    borderHoverWarning: '1px solid #f17e44',
    borderWarning: '1px solid #DDDDDD',
    borderPressedWarning: '1px solid #f17e44',
    colorDisabledWarning: '#e5e5e9FF',
    colorFocusWarning: '#ffffffFF',
    colorHoverWarning: '#ffffffFF',
    colorWarning: '#f2f3f5FF',
    colorPressedWarning: '#ffFFFFFF',
    rippleColorWarning: '#f17e44FF',
    textColorDisabledWarning: '#333333FF',
    textColorFocusWarning: '#f17e44FF',
    textColorHoverWarning: '#f17e44FF',
    textColorWarning: '#666666FF',
    textColorPressedWarning: '#f17e44FF',
    // type info
    borderInfo: '1px solid rgba(249,89,9, 0.5)',
    borderFocusInfo: '1px solid rgba(249,89,9, 0.5)',
    borderHoverInfo: '1px solid rgb(249,89,9)',
    borderPressedInfo: '1px solid rgb(249,89,9)',
    colorInfo: '#FDF0E9',
    colorDisabledInfo: '#EA5703',
    borderDisabledInfo: '1px solid rgba(249,89,9, 0.5)',
    colorFocusInfo: '#FDF0E9',
    colorHoverInfo: '#ffffff',
    colorPressedInfo: '#ffffff',
    textColorInfo: '#EA5703',
    textColorFocusInfo: '#EA5703',
    textColorHoverInfo: '#EA5703',
    textColorPressedInfo: '#EA5703',

    // common
    iconSizeLarge: '16px',
    heightSmall: '28px',
    colorOpacitySecondary: '0.1'
  },
  Collapse: {
    dividerColor: '#E7E7E7'
  },
  Card: {
    borderColor: '#FFFFFFFF'
  },
  Checkbox: {
    sizeMedium: '14px'
  },
  DataTable: {
    borderColor: '#ECEEF2',
    thTextColor: '#8B92A0',
    thColorModal: '#F2F2F5',
    paginationMargin: '10px 16px 10px 0',
    lineHeight: '22px',
    thFontWeight: '400',
    fontSizeSmall: '12px',
    thPaddingSmall: '6.5px 8px',
    tdPaddingSmall: '6.5px 8px',
    fontSizeMedium: '12px',
    thPaddingMedium: '8.5px 10px',
    tdPaddingMedium: '8.5px 10px',
    fontSizeLarge: '12px',
    thPaddingLarge: '10.5px 10px',
    tdPaddingLarge: '10.5px 10px',
    peers: {
      Pagination: {
        itemBorderHover: '1px solid #DBDFE7',
        peers: {
          Select: {
            peers: {
              InternalSelection: {
                heightSmall: '28px'
              }
            }
          },
          Input: {
            heightSmall: '28px'
          }
        }
      }
    }
  },
  Drawer: {
    headerPadding: '16px 20px',
    bodyPadding: '25px 30px 30px 30px',
    titleFontSize: '16px',
    closeIconColor: '#e6eaf7',
    closeIconColorHover: '#fff'
  },
  Form: {
    asteriskColor: '#F73838'
  },
  Input: {
    countTextColor: '#cccccc',
    fontSizeSmall: '12px'
  },
  InputNumber: {},
  Layout: {
    color: '#F9FAFFFF',
    headerColor: '#ffffff',
    siderColor: '#ffffff'
  },
  Pagination: {
    itemBorderHover: '1px solid #DBDFE7',
    itemColorActive: '#EA5703',
    itemTextColorActive: '#FFFFFFFF',
    itemSizeMedium: '28px',
    itemColorActiveHover: '#EA5703'
  },
  Table: {
    thFontWeight: '400',
    thColorModal: '#F3F5FB',
    lineHeight: '22px',
    fontSizeSmall: '12px',
    thPaddingSmall: '6.5px 8px',
    tdPaddingSmall: '6.5px 8px',
    fontSizeMedium: '12px',
    thPaddingMedium: '8.5px 10px',
    tdPaddingMedium: '8.5px 10px',
    fontSizeLarge: '12px',
    thPaddingLarge: '10.5px 10px',
    tdPaddingLarge: '10.5px 10px'
  },
  Tabs: {
    tabPaddingLargeLine: '16px 0',
    tabFontWeight: '600',
    tabFontWeightActive: '600',
    tabGapMediumCard: '0px',
    tabColor: '#f9fafd',
    tabBorderRadius: '0'
  },
  Timeline: {
    contentTextColor: '#999',
    metaTextColor: '#999',
    lineColor: '#e5e6eb',
    iconSizeMedium: '10px',
    circleBorder: 'unset'
  },
  Upload: {
    draggerColor: '#F2F3F5'
  }
}

export default themes

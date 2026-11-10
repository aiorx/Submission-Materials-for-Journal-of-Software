var _import = require('react');
var Field = require('redux-form').Field;
var change = require('redux-form').change;
var connect = require('react-redux').connect;
var t = require('locales/use-translation');
var includes = require('lodash').includes;
var debounce = require('lodash/debounce');
var View = require('react-native').View;
var TouchableOpacity = require('react-native').TouchableOpacity;
var ScrollView = require('react-native').ScrollView;
var Animated = require('react-native').Animated;
var commonSelector = require('stores/common/selectors').commonSelector;
var styles = require('./styles');
var colors = require('@/styles').colors;
import {
  AssetSvg,
  BaseInput,
  AnimateModal,
  HtmlView,
  Text,
  BaseLabel
} from '@/components';
var hasTextLength = require('@/constants').hasTextLength;
var hasValue = require('@/constants').hasValue;
var hitSlop = require('@/constants').hitSlop;
var isEmpty = require('@/constants').isEmpty;
var dismissKeyboard = require('@/helpers/keyboard').dismissKeyboard;
var SCREEN_WIDTH = require('@/helpers/size').SCREEN_WIDTH;
var IProps = require('./type.d').IProps;
var IStates = require('./type.d').IStates;

const PLACEHOLDER_TYPES = {
  CUSTOMER: 'Customer',
  INVOICE: 'Invoice',
  ESTIMATE: 'Estimate',
  EXPENSE: 'Expense',
  PAYMENT: 'Payment',
  PREDEFINE_CUSTOMER: 'Predefine_Customer',
  PREDEFINE_COMPANY: 'Predefine_Company',
  PREDEFINE_BILLING: 'Predefine_Billing',
  PREDEFINE_SHIPPING: 'Predefine_Shipping'
};

class EditorComponent extends Component<IProps, IStates> {
  animatedOpacityReverse: any;
  constructor(props) {
    super(props);
    this.animatedOpacityReverse = new Animated.Value(1);

    this.state = {
      visible: false,
      preview: props?.showPreview ? true : false,
      hasError: false
    };
  }

  componentDidMount() {
    (this.props.reference == null ? undefined : this.props.reference(this));
    this.setHasErrorToTrue = debounce(this.setHasErrorToTrue, 300);
  }

  componentWillUnmount() {
    // this.props?.reference?.(undefined);
  }

  onToggleModal = function () {
    dismissKeyboard();
    this.setState({visible: !this.state.visible});
  };

  togglePreview = function () {
    var isAllowToEdit = this.props.isAllowToEdit;
    const disabled = !isAllowToEdit;

    if (disabled) {
      return;
    }

    this.reverseOpacityAnimation();

    setTimeout(() => {
      this.setState({preview: !this.state.preview});
      this.reverseOpacityAnimation(1);
    }, 300);
  };

  reverseOpacityAnimation = function (toValue = 0) {
    Animated.timing(this.animatedOpacityReverse, {
      toValue,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  setHasErrorToTrue = function hasError {
    this.setState({hasError});
  };

  onSelectPlaceholder = function value {
    this.onToggleModal();
    this.updateValue(value);
  };

  updateValue = function value {
    var dispatch = this.props.dispatch;
var form = this.props.form;
var name = this.props.name;
var formValues = this.props.formValues;
    let val = '';

    if (hasValue((formValues == null ? undefined : formValues[name]))) {
      val = "" + (formValues[name]) + "{" + (value) + "}";
    } else {
      val = "{" + (value) + "}";
    }

    dispatch(change(form, name, val));
  };

  getFormattedFields = function (fields, type) {
    const formattedFields = [];

    for (const field of fields) {
      if (field.model_type === type) {
        formattedFields.push({
          label: field.label,
          value: field.slug
        });
      }
    }

    const canAddLink = !(
      type === PLACEHOLDER_TYPES.CUSTOMER || type === PLACEHOLDER_TYPES.EXPENSE
    );

    if (canAddLink) {
      formattedFields.push({
        label: "" + (type) + " Link",
        value: "" + (type.toUpperCase()) + "_LINK"
      });
    }

    return {
      label: "" + (type.toUpperCase()) + " CUSTOM",
      fields: formattedFields
    };
  };

  getFields = function () {
    var customFields = this.props.customFields;
var types = this.props.types;

    if (isEmpty(types)) {
      return [];
    }

    const items = [];

    if (includes(types, PLACEHOLDER_TYPES.PREDEFINE_COMPANY)) {
      items.push({
        label: 'Company',
        fields: [
          {label: 'Company Name', value: 'COMPANY_NAME'},
          {label: 'Country', value: 'COMPANY_COUNTRY'},
          {label: 'State', value: 'COMPANY_STATE'},
          {label: 'City', value: 'COMPANY_CITY'},
          {
            label: 'Address Street 1',
            value: 'COMPANY_ADDRESS_STREET_1'
          },
          {
            label: 'Address Street 2',
            value: 'COMPANY_ADDRESS_STREET_2'
          },
          {label: 'Phone', value: 'COMPANY_PHONE'},
          {label: 'Zip Code', value: 'COMPANY_ZIP_CODE'}
        ]
      });
    }

    if (includes(types, PLACEHOLDER_TYPES.PREDEFINE_BILLING)) {
      items.push({
        label: 'Billing Address',
        fields: [
          {label: 'Address name', value: 'BILLING_ADDRESS_NAME'},
          {label: 'Country', value: 'BILLING_COUNTRY'},
          {label: 'State', value: 'BILLING_STATE'},
          {label: 'City', value: 'BILLING_CITY'},
          {
            label: 'Address Street 1',
            value: 'BILLING_ADDRESS_STREET_1'
          },
          {
            label: 'Address Street 2',
            value: 'BILLING_ADDRESS_STREET_2'
          },
          {label: 'Phone', value: 'BILLING_PHONE'},
          {label: 'Zip Code', value: 'BILLING_ZIP_CODE'}
        ]
      });
    }

    if (includes(types, PLACEHOLDER_TYPES.PREDEFINE_SHIPPING)) {
      items.push({
        label: 'Shipping Address',
        fields: [
          {label: 'Address name', value: 'SHIPPING_ADDRESS_NAME'},
          {label: 'Country', value: 'SHIPPING_COUNTRY'},
          {label: 'State', value: 'SHIPPING_STATE'},
          {label: 'City', value: 'SHIPPING_CITY'},
          {
            label: 'Address Street 1',
            value: 'SHIPPING_ADDRESS_STREET_1'
          },
          {
            label: 'Address Street 2',
            value: 'SHIPPING_ADDRESS_STREET_2'
          },
          {label: 'Phone', value: 'SHIPPING_PHONE'},
          {label: 'Zip Code', value: 'SHIPPING_ZIP_CODE'}
        ]
      });
    }

    if (includes(types, PLACEHOLDER_TYPES.PREDEFINE_CUSTOMER)) {
      items.push({
        label: 'CUSTOMER',
        fields: [
          {label: 'Display Name', value: 'CONTACT_DISPLAY_NAME'},
          {label: 'Contact Name', value: 'PRIMARY_CONTACT_NAME'},
          {label: 'Email', value: 'CONTACT_EMAIL'},
          {label: 'Phone', value: 'CONTACT_PHONE'},
          {label: 'Website', value: 'CONTACT_WEBSITE'}
        ]
      });
    }

    for (const type of types) {
      for (const field of customFields) {
        if (field.model_type === type) {
          items.push(this.getFormattedFields(customFields, type));
          break;
        }
      }
    }

    return this.getFieldsView(items);
  };

  getFieldsView = function items {
    if (isEmpty(items)) {
      return [];
    }

    return items.map((item, index) => {
      var label = item.label;
var fields = item.fields;
      const isFirst = index === 0;
      const isOnlyOne = items.length === 1;

      const containerStyle = [
        !isFirst && {paddingLeft: 15},
        isOnlyOne && {
          width: SCREEN_WIDTH - 50
        }
      ];

      return (
        <View style={containerStyle}>
          <View style={styles.labelView}>
            <Text h4 darkGray medium numberOfLines={1}>
              {label}
            </Text>
          </View>
          {fields.map(field => (
            <TouchableOpacity
              onPress={() => this.onSelectPlaceholder(field.value)}
              style={styles.item}
            >
              <View style={styles.arrowIcon}>
                <AssetSvg
                  name={AssetSvg.icons.double_right}
                  width={14}
                  height={14}
                />
              </View>
              <Text
                darkGray2
                h4
                medium
                style={styles.itemText}
                numberOfLines={1}
              >
                {field.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    });
  };

  getValue = function () {
    var name = this.props.name;
var formValues = this.props.formValues;

    if (name.includes('.')) {
      const split = name.split('.');
      return (formValues == null ? undefined : formValues[split[0]])] == null ? undefined : .[split[0]][split[1]]);
    }

    return (formValues == null ? undefined : formValues[name]);
  };

  render() {
    var name = this.props.name;
var isRequired = this.props.isRequired;
var customRightLabelComponent = this.props.customRightLabelComponent;
var fieldInputProps = this.props.fieldInputProps;
var placeholder = this.props.placeholder;
var htmlViewStyle = this.props.htmlViewStyle;
var containerStyle = this.props.containerStyle;
var previewContainerStyle = this.props.previewContainerStyle;
var labelStyle = this.props.labelStyle;
var previewLabelStyle = this.props.previewLabelStyle;
var isAllowToEdit = this.props.isAllowToEdit;
var theme = this.props.theme;
    var visible = this.state.visible;
var preview = this.state.preview;
var hasError = this.state.hasError;
    const disabled = !isAllowToEdit;
    const items = this.getFields();
    const hasFields = !isEmpty(items);
    const value = this.getValue();

    const label = (
      <View style={[styles.row, labelStyle, preview && previewLabelStyle]}>
        <View style={{flex: 1}}>
          <BaseLabel isRequired={isRequired}>{t(this.props.label)}</BaseLabel>
        </View>
        {!disabled && (
          <Animated.View
            style={[styles.rowCenter, {opacity: this.animatedOpacityReverse}]}
          >
            {preview ? (
              <TouchableOpacity
                onPress={this.togglePreview}
                hitSlop={hitSlop(20, 25, 20, 20)}
              >
                <View style={styles.pencilIconView}>
                  <AssetSvg
                    name={AssetSvg.icons.pencil}
                    width={19}
                    height={19}
                    fill={colors.primaryLight}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <>
                {customRightLabelComponent && customRightLabelComponent}
                {hasFields && (
                  <TouchableOpacity
                    onPress={this.onToggleModal}
                    hitSlop={hitSlop(10, 5, 10, 5)}
                  >
                    <Text
                      h5
                      medium={theme?.mode === 'dark'}
                      style={styles.insertFields}
                      color={theme?.viewLabel?.thirdColor}
                    >
                      {t('notes.insert_fields')}
                    </Text>
                  </TouchableOpacity>
                )}

                {hasValue(value) && hasTextLength(value) && (
                  <TouchableOpacity
                    onPress={this.togglePreview}
                    style={styles.eyeIconView}
                    hitSlop={hitSlop(20, 10, 30, 10)}
                  >
                    <AssetSvg
                      name={AssetSvg.icons.eye}
                      width={24}
                      height={24}
                      fill={colors.primaryLight}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </Animated.View>
        )}
      </View>
    );

    let fieldProps = {};
    if (isRequired) {
      fieldProps = {
        onError: this.setHasErrorToTrue
      };
    }

    const field = (
      <Field
        name={name}
        component={BaseInput}
        height={150}
        placeholder={placeholder}
        inputProps={{multiline: true}}
        disabled={disabled}
        {...fieldInputProps}
        {...fieldProps}
      />
    );

    const modal = (
      <AnimateModal
        visible={visible}
        onToggle={this.onToggleModal}
        modalProps={{
          animationIn: 'slideInUp',
          animationOut: 'slideOutDown'
        }}
      >
        <View style={styles.modalViewContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            <View style={styles.body}>
              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View style={styles.items}>{items}</View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </AnimateModal>
    );

    const htmlPreview = (
      <Animated.View
        style={[
          styles.htmlView(theme),
          {
            opacity: this.animatedOpacityReverse
          },
          htmlViewStyle,
          hasError && styles.error,
          disabled && styles.disabledInput(theme)
        ]}
      >
        <HtmlView
          content={hasValue(value) && hasTextLength(value) ? value : '<p></p>'}
          theme={theme}
        />
        {hasError && (
          <View style={styles.validation}>
            <Text white h6 numberOfLines={1}>
              {t('validation.required')}
            </Text>
          </View>
        )}
      </Animated.View>
    );

    const children = (
      <View style={[containerStyle, preview && previewContainerStyle]}>
        {label}
        {!preview ? (
          <Animated.View style={{opacity: this.animatedOpacityReverse}}>
            {field}
            {modal}
          </Animated.View>
        ) : (
          htmlPreview
        )}
      </View>
    );

    return children;
  }
}

const mapStateToProps = function state { return commonSelector(state); };

const Editor = connect(mapStateToProps)(EditorComponent);

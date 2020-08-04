exports.settingsSchema = [
  {
    setting_name: "Email Verification Callback",
    setting_type: "String",
    setting_key: "emailVerifyCallback",
    setting_required: true,
    setting_value: null,
  },
  {
    setting_name: "Password Reset Callback",
    setting_type: "String",
    setting_key: "passwordResetCallback",
    setting_required: true,
    setting_value: null,
  },
  {
    setting_name: "Login Success Callback",
    setting_type: "String",
    setting_key: "successCallback",
    setting_required: true,
    setting_value: null,
  },
  {
    setting_name: "MongoDB URI",
    setting_type: "String",
    setting_key: "mongoDbUri",
    setting_required: true,
    setting_value: null,
  },
  {
    setting_name: "Facebook Credentials",
    setting_type: "Array",
    setting_key: "facebookAuthProvider",
    setting_required: false,
    setting_value: [
      {
        setting_name: "Facebook Application ID",
        setting_type: "String",
        setting_key: "appID",
        setting_value: null,
        setting_required: true,
      },
      {
        setting_name: "Facebook Application Secret",
        setting_type: "String",
        setting_key: "appSecret",
        setting_value: null,
        setting_required: true,
      },
      {
        setting_name: "Login Success Callback",
        setting_type: "String",
        setting_key: "successCallback",
        setting_required: false,
        setting_value: null,
      },
    ],
  },
  {
    setting_name: "Twitter Credentials",
    setting_type: "Array",
    setting_key: "twitterAuthProvider",
    setting_required: false,
    setting_value: [
      {
        setting_name: "Twitter Consumer Key",
        setting_type: "String",
        setting_key: "key",
        setting_value: null,
        setting_required: true,
      },
      {
        setting_name: "Twitter Consumer Secret",
        setting_type: "String",
        setting_key: "secret",
        setting_value: null,
        setting_required: true,
      },
    ],
  },
  {
    setting_name: "Github Credentials",
    setting_type: "Array",
    setting_key: "githubAuthProvider",
    setting_required: false,
    setting_value: [
      {
        setting_name: "Github Client ID",
        setting_type: "String",
        setting_key: "clientID",
        setting_value: null,
        setting_required: true,
      },
      {
        setting_name: "Github Client Secret",
        setting_type: "String",
        setting_key: "clientSecret",
        setting_value: null,
        setting_required: true,
      },
    ],
  },
  {
    setting_name: "Google Credentials",
    setting_type: "Array",
    setting_key: "googleAuthProvider",
    setting_required: false,
    setting_value: [
      {
        setting_name: "Google Client ID",
        setting_type: "String",
        setting_key: "clientID",
        setting_value: null,
        setting_required: true,
      },
      {
        setting_name: "Google Client Secret",
        setting_type: "String",
        setting_key: "clientSecret",
        setting_value: null,
        setting_required: true,
      },
    ],
  },
];

exports.parseSettings = (data) => {
  return data.reduce((acc, item) => {
    if (item["setting_type"] == "Array") {
      const newTemp = parseSettings(item.setting_value);
      return { ...acc, [item["setting_key"]]: newTemp };
    }
    const temp = acc;
    temp[item.setting_key] = item.setting_value;
    return { ...acc, ...temp };
  }, {});
};

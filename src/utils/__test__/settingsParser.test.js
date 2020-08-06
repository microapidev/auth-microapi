import { parseSettings } from "../settingsParser";

describe("Settings Parser test", () => {
  it("should return two settings", () => {
    const dummySetting = [
      {
        setting_name: "Setting 1",
        setting_type: "String",
        setting_key: "setting1",
        setting_value: null,
        setting_required: false,
      },
      {
        setting_name: "Setting 2",
        setting_type: "Number",
        setting_key: "setting2",
        setting_value: null,
        setting_required: false,
      },
    ];
    const settings = parseSettings(dummySetting);
    expect(Object.keys(settings).length).toBe(2);
  });

  it("should return two settings and one required error", () => {
    const dummySetting = [
      {
        setting_name: "Setting 1",
        setting_type: "String",
        setting_key: "setting1",
        setting_value: null,
        setting_required: true,
      },
      {
        setting_name: "Setting 2",
        setting_type: "Number",
        setting_key: "setting2",
        setting_value: 5,
        setting_required: true,
      },
    ];
    const settings = parseSettings(dummySetting, true);
    console.log(settings);
    expect(Object.keys(settings).length).toBe(3);
    expect(settings.errors.length).toBe(1);
  });

  it("should return two settings, one nested setting and one required error", () => {
    const dummySetting = [
      {
        setting_name: "Setting 1",
        setting_type: "String",
        setting_key: "setting1",
        setting_value: null,
        setting_required: true,
      },
      {
        setting_name: "Setting 2",
        setting_type: "Number",
        setting_key: "setting2",
        setting_value: 5,
        setting_required: true,
      },
      {
        setting_name: "Setting 3",
        setting_type: "Array",
        setting_key: "setting3",
        setting_required: true,
        setting_value: [
          {
            setting_name: "Setting 4",
            setting_type: "Number",
            setting_key: "setting4",
            setting_value: null,
            setting_required: true,
          },
          {
            setting_name: "Setting 5",
            setting_type: "String",
            setting_key: "setting5",
            setting_value: 5,
            setting_required: true,
          },
        ],
      },
    ];
    const settings = parseSettings(dummySetting, true);
    console.log(settings);
    expect(Object.keys(settings.setting3).length).toBe(2);
    expect(settings.errors.length).toBe(3);
  });

  it("should return two settings and one type error one required error", () => {
    const dummySetting = [
      {
        setting_name: "Setting 1",
        setting_type: "String",
        setting_key: "setting1",
        setting_value: 5,
        setting_required: true,
      },
      {
        setting_name: "Setting 2",
        setting_type: "Number",
        setting_key: "setting2",
        setting_value: null,
        setting_required: true,
      },
    ];
    const settings = parseSettings(dummySetting, true);
    console.log(settings);
    expect(Object.keys(settings).length).toBe(3);
    expect(settings.errors.length).toBe(2);
  });
});

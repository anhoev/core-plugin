module.exports = cms => {
  cms.post('getTypes', async function (info) {
    const localeConfig = await cms.getModel('SystemConfig').findOne({type: 'I18n'});
    if (localeConfig && localeConfig.content) {
      info.locale = localeConfig.content.locale;
    }
  });
}

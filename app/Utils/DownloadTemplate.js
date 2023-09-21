export const downloadTemplate = (template) => {
    const templateUrl = `/${template}.xlsx`;
    const a = document.createElement('a');
    a.href = templateUrl;
    a.download = `${template}.xlsx`;
    a.click();
  };
function responseBuilder(resCodigo, resMensagem) {
  return JSON.stringify({
    code: resCodigo,
    data: resMensagem,
    timestamp: Date.now(),
  });
}

export default responseBuilder;

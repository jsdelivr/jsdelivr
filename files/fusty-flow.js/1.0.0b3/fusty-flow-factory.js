function fustyFlowFactory(opts) {
  var flow = new Flow(opts);
  if (flow.support) {
    return flow;
  }
  return new FustyFlow(opts);
}
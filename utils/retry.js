// Utility
// retry promise function retryCount times.
// abort retry depends on:
// successCondition and resuls of async factoryFn
// and combination 2 of them must brings truish value
// uses recursion
const { wait } = require("./wait");

async function retry({
  promiseFactory,
  successCondition,
  retryCount,
  timeout,
}) {
  let results;
  const fnName = promiseFactory.name;
  try {
    await wait(timeout);
    const executeResults = await promiseFactory();
    results = successCondition(executeResults);
  } catch (error) {
    console.log("retry.js error: ", error);
    return false;
  }
  if (results) {
    return true;
  } else {
    if (retryCount <= 0) {
      // uncomment for debugging
      // console.log(
      //   `     [retry.js]: retry fn: ${fnName} ${retryCount} retry no. left. No success! Return false!`
      // );
      return false;
    }
    return await retry({
      promiseFactory,
      successCondition,
      retryCount: retryCount - 1,
      timeout,
    });
  }
}

module.exports = { retry };

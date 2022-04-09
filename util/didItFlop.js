import reactStringReplace from "react-string-replace";

export default function didItFlop(title, profit, ratings, colors) {
  const { audienceScore, criticScore } = ratings;
  let msg = "";
  let flopped = false;
  const formattedProfit =
    "$" + new Intl.NumberFormat().format(Math.abs(profit));

  const notHugeProfit = profit < 500000000;

  if (profit < 0) {
    flopped = true;
    msg = `${title} lost about __MONEY`;
  }
  if (profit > 0) {
    flopped = false;
    if (notHugeProfit) {
      msg = `${title} made about __MONEY`;
    }
    if (profit >= 500000000) {
      msg = `${title} was the opposite of a flop. It made about __MONEY!`;
    }
  }

  if (flopped === true) {
    if (criticScore > 75) {
      msg = msg + "... but critics loved it!";
    } else if (audienceScore > 75) {
      msg = msg + "... but viewers loved it!";
    } else if (criticScore > 60) {
      msg = msg + ", but critics thought it was okay.";
    } else if (audienceScore > 60) {
      msg = msg + ", but viewers thought it was okay.";
    } else {
      msg = msg + ".";
    }
  } else if (flopped === false) {
    const transitionPhrase = notHugeProfit ? ", but" : " Then again, ";
    if (criticScore < 50) {
      msg = msg + `${transitionPhrase} critics weren't too big on it...`;
    } else if (audienceScore < 50) {
      flopped = false;
      msg = msg + `${transitionPhrase} viewers didn't really like it...`;
    } else {
      if (notHugeProfit) {
        // We don't want to add a period if we already have an exclamation mark
        msg = msg + ".";
      }
    }
  }

  const elem = reactStringReplace(msg, "__MONEY", (m, i) => (
    <span key={i} style={{ color: flopped ? colors.failure : colors.success }}>
      {formattedProfit}
    </span>
  ));

  return { msg: elem, flopped };
}

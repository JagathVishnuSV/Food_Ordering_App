// Small Strategy pattern implementation to compute final price from rules
class PricingStrategy {
  apply(price, rule) {
    throw new Error('Not implemented');
  }
}

class PercentageTax extends PricingStrategy {
  apply(price, rule) {
    return price + (price * rule.value) / 100;
  }
}

class FixedTax extends PricingStrategy {
  apply(price, rule) {
    return price + rule.value;
  }
}

class PercentageDiscount extends PricingStrategy {
  apply(price, rule) {
    return price - (price * rule.value) / 100;
  }
}

class FixedDiscount extends PricingStrategy {
  apply(price, rule) {
    return price - rule.value;
  }
}

const registry = {
  tax: {
    percentage: new PercentageTax(),
    fixed: new FixedTax()
  },
  discount: {
    percentage: new PercentageDiscount(),
    fixed: new FixedDiscount()
  }
};

function calculateFinalPrice(menuItem, pricingRules = []) {
  let price = menuItem.price;
  // Apply taxes first, then discounts (order may be adjusted per business rules)
  const taxes = pricingRules.filter(r => r.type === 'tax');
  const discounts = pricingRules.filter(r => r.type === 'discount');

  taxes.forEach(rule => {
    const strat = registry.tax[rule.strategy];
    if (strat) price = strat.apply(price, rule);
  });

  discounts.forEach(rule => {
    const strat = registry.discount[rule.strategy];
    if (strat) price = strat.apply(price, rule);
  });

  return Math.max(0, Number(price.toFixed(2)));
}

module.exports = { calculateFinalPrice, registry };
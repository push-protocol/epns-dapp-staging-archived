function yfStakedValue(yfContract, uniswapContract) {
  const poolSize = yfContract.nextPoolSize;
  const price = uniswapContract.stablePrice;

  if (poolSize === undefined || price === undefined) {
    return undefined;
  }

  return poolSize.multipliedBy(price);
}

function yfEffectiveStakedValue(yfContract, uniswapContract) {
  const { poolSize } = yfContract;
  const price = uniswapContract.stablePrice;

  if (poolSize === undefined || price === undefined) {
    return undefined;
  }

  return poolSize.multipliedBy(price);
}

function yfLPStakedValue(yfLPContract, uniswapContract) {
  const poolSize = yfLPContract.nextPoolSize;
  const price = uniswapContract.unilpPrice;

  if (poolSize === undefined || price === undefined) {
    return undefined;
  }

  return poolSize.multipliedBy(price);
}

function myLPStakedValue(yfLPContract, uniswapContract) {
  const epochStake = yfLPContract.nextEpochStake;
  const price = uniswapContract.unilpPrice;

  if (epochStake === undefined || price === undefined) {
    return undefined;
  }

  return epochStake.multipliedBy(price);
}

function yfLPEffectiveStakedValue(yfLPContract, uniswapContract) {
  const { poolSize } = yfLPContract;
  const price = uniswapContract.unilpPrice;

  if (poolSize === undefined || price === undefined) {
    return undefined;
  }

  return poolSize.multipliedBy(price);
}

function myLPEffectiveStakedValue(yfLPContract, uniswapContract) {
  const { epochStake } = yfLPContract;
  const price = uniswapContract.unilpPrice;

  if (epochStake === undefined || price === undefined) {
    return undefined;
  }

  return epochStake.multipliedBy(price);
}

function yfpushStakedValue(yfPUSHContract, uniswapContract) {
  const poolSize = yfPUSHContract.nextPoolSize;
  const price = uniswapContract.pushPrice;

  if (poolSize === undefined || price === undefined) {
    return undefined;
  }

  return poolSize.multipliedBy(price);
}

function mypushStakedValue(yfPUSHContract, uniswapContract) {
  const epochStake = yfPUSHContract.nextEpochStake;
  const price = uniswapContract.pushPrice;

  if (epochStake === undefined || price === undefined) {
    return undefined;
  }

  return epochStake.multipliedBy(price);
}

function yfPUSHEffectiveStakedValue(yfPUSHContract, uniswapContract) {
  const { poolSize } = yfPUSHContract;
  const price = uniswapContract.pushPrice;

  if (poolSize === undefined || price === undefined) {
    return undefined;
  }

  return poolSize.multipliedBy(price);
}

function myPushEffectiveStakedValue(yfPUSHContract, uniswapContract) {
  const { epochStake } = yfPUSHContract;
  const price = uniswapContract.pushPrice;

  if (epochStake === undefined || price === undefined) {
    return undefined;
  }

  return epochStake.multipliedBy(price);
}

function pushLockedPrice(daoBarnContract, uniswapContract) {
  const { pushStaked } = daoBarnContract;
  const price = uniswapContract.pushPrice;

  if (pushStaked === undefined || price === undefined) {
    return undefined;
  }

  return pushStaked.multipliedBy(price);
}

function totalStaked() {
  const yfLPStaked = yfLPStakedValue();
  const yfpushStaked = yfpushStakedValue();

  if (
    yfLPStaked === undefined ||
    yfpushStaked === undefined
  ) {
    return undefined;
  }

  let total = ZERO_BIG_NUMBER;

  if (yfLPContract.isEnded === false) {
    total = total.plus(yfLPStaked);
  }

  if (yfPUSHContract.isEnded === false) {
    total = total.plus(yfpushStaked);
  }

  return total;
}

function totalEffectiveStaked() {
  const yfLPStaked = yfLPEffectiveStakedValue();
  const yfpushStaked = yfPUSHEffectiveStakedValue();

  if (
    yfLPStaked === undefined ||
    yfpushStaked === undefined
  ) {
    return undefined;
  }

  let total = ZERO_BIG_NUMBER;

  if (yfLPContract.isEnded === false) {
    total = total.plus(yfLPStaked);
  }

  if (yfPUSHContract.isEnded === false) {
    total = total.plus(yfpushStaked);
  }

  return total;
}

function totalCurrentReward(yfLPContract, yfPUSHContract) {
  const yfLPReward =
    yfLPContract.currentEpoch === 0
      ? ZERO_BIG_NUMBER
      : yfLPContract.currentReward;
  const yfPUSHReward =
    yfPUSHContract.currentEpoch === 0
      ? ZERO_BIG_NUMBER
      : yfPUSHContract.currentReward;

  if (
    yfLPReward === undefined ||
    yfPUSHReward === undefined
  )
    return undefined;

  return yfLPReward.plus(yfPUSHReward);
}

function totalPotentialReward(yfLPContract, yfPUSHContract) {
  const yfLPReward = yfLPContract.potentialReward;
  const yfPUSHReward = yfPUSHContract.potentialReward;

  if (
    yfLPReward === undefined ||
    yfPUSHReward === undefined
  )
    return undefined;

  let total = ZERO_BIG_NUMBER;

  if (yfLPContract.isEnded === false) {
    total = total.plus(yfLPReward);
  }

  if (yfPUSHContract.isEnded === false) {
    total = total.plus(yfPUSHReward);
  }

  return total;
}

function totalPushReward(yfLPContract, yfPUSHContract) {
  const yfLPTotalReward = yfLPContract.totalReward;
  const yfPUSHTotalReward = yfPUSHContract.totalReward;

  if (
    yfLPTotalReward === undefined ||
    yfPUSHTotalReward === undefined
  )
    return undefined;

  return yfLPTotalReward.plus(yfPUSHTotalReward);
}

function pushReward(yfLPContract, yfPUSHContract) {
  const yfLPReward = yfLPContract.pushReward;
  const yfPUSHReward = yfPUSHContract.pushReward;

  if (
    yfLPReward === undefined ||
    yfPUSHReward === undefined
  )
    return undefined;

  return yfLPReward.plus(yfPUSHReward);
}

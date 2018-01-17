'use strict';

//list of truckers
//useful for ALL 5 exercises
var truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL exercises
//The `price` is updated from exercice 1
//The `commission` is updated from exercice 3
//The `options` is useful from exercice 4
var deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from exercise 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

function findTruckerById(truckerId) {
  var res = 0;
  truckers.forEach(function(trucker) {
      if (trucker.id === truckerId) {
        res = trucker;
      }
  });
  return res;
}

function findDeliveryById(deliveryId) {
  var res = 0;
  deliveries.forEach(function(delivery) {
      if (delivery.id === deliveryId) {
          res = delivery;
      }
  });
  return res;
}

function updateDeliveryPrice(delivery) {
  var trucker = findTruckerById(delivery.truckerId);
  if (trucker === 0) {
    return;
  }
  delivery.price = delivery.distance * trucker.pricePerKm;

  var deliveryPricePerVolume = trucker.pricePerVolume;
  if (delivery.volume > 25) {
    deliveryPricePerVolume = trucker.pricePerVolume - trucker.pricePerVolume * 50 / 100;
  } else if (delivery.volume > 10) {
    deliveryPricePerVolume = trucker.pricePerVolume - trucker.pricePerVolume * 30 / 100;
  } else if (delivery.volume > 5) {
    deliveryPricePerVolume = trucker.pricePerVolume - trucker.pricePerVolume * 10 / 100;
  }

  if (delivery.options.deductibleReduction) {
    deliveryPricePerVolume += 1;
  }

  delivery.price += delivery.volume * deliveryPricePerVolume;
}

function updateDeliveryCommission(delivery) {
  var commission = delivery.price * 30 / 100;
  delivery.commission.insurance = commission / 2;
  delivery.commission.treasury = Math.ceil(delivery.distance / 500);
  delivery.commission.convargo = commission - delivery.commission.insurance - delivery.commission.treasury;
}

function executeDeliveryPayment(delivery, actor) {

  var convargoPayment = delivery.commission.convargo;
  var truckerPayment = delivery.price * 70 / 100;

  if (delivery.options.deductibleReduction) {
    convargoPayment += delivery.volume;
    truckerPayment -= delivery.volume;
  }

  actor.payment.find(function (transaction) {
      return transaction.who === "shipper" && transaction.type === "debit";
  }).amount = delivery.price;

  actor.payment.find(function (transaction) {
      return transaction.who === "convargo" && transaction.type === "credit";
  }).amount = convargoPayment;

  actor.payment.find(function (transaction) {
      return transaction.who === "trucker" && transaction.type === "credit";
  }).amount = truckerPayment;

  actor.payment.find(function (transaction) {
      return transaction.who === "treasury" && transaction.type === "credit";
  }).amount = delivery.commission.treasury;

  actor.payment.find(function (transaction) {
      return transaction.who === "insurance" && transaction.type === "credit";
  }).amount = delivery.commission.insurance;
}

deliveries.forEach(function(delivery) {
  updateDeliveryPrice(delivery);
  updateDeliveryCommission(delivery);
});

actors.forEach(function (actor) {
    var delivery = findDeliveryById(actor.deliveryId);
    executeDeliveryPayment(delivery, actor);
});

console.log(deliveries);
console.log(actors);
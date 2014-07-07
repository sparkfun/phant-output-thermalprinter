/**
 * phant-output-thermalprinter
 * https://github.com/sparkfun/phant-output-thermalprinter
 *
 * Copyright (c) 2014 SparkFun Electronics
 * Licensed under the GPL v3 license.
 */

'use strict';

/**** Module dependencies ****/
var _ = require('lodash'),
    util = require('util'),
    events = require('events');

/**** Make PhantOutput an event emitter ****/
util.inherits(PhantOutput, events.EventEmitter);

/**** PhantOutput prototype ****/
var app = PhantOutput.prototype;

/**** Expose PhantOutput ****/
exports = module.exports = PhantOutput;

/**** Initialize a new PhantOutput ****/
function PhantOutput(config) {

  if (!(this instanceof PhantOutput)) {
    return new PhantOutput(config);
  }

  events.EventEmitter.call(this);

  util._extend(this, config || {});

}

app.name = 'Thermal Printer Output';


/**
 * phant-output-thermalprinter
 * https://github.com/sparkfun/phant-output-thermalprinter
 *
 * Copyright (c) 2014 SparkFun Electronics
 * Licensed under the GPL v3 license.
 */

'use strict';

/**** Module dependencies ****/
var SerialPort = require('serialport').SerialPort,
    async = require('async'),
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

  this.init();

}

app.name = 'Thermal Printer Output';
app.serial = false;
app.keychain = false;
app.baud = 19200;
app.path = '/dev/ttyO0'; // beaglebone black UART0

app.init = function() {

  this.serial = new SerialPort(this.path, {
    baudrate: this.baud
  });

  // send the init command
  this.send(Buffer([0x1b, 0x40]));

};

app.send = function(buffer, callback) {

  this.serial.write(buffer, function() {
    this.serial.drain(callback);
  }.bind(this));

};

app.write = function(id, data) {

  var queue = [];

  if (!this.serial) {
    return this.emit('error', 'printer init failed');
  }

  // title
  queue.push(Buffer([0x1b, 0x21, 0x8])); // bold
  queue.push(Buffer('Stream ' + this.keychain.publicKey(id)));
  queue.push(Buffer([0x1b, 0x21, 0x0])); // normal
  queue.push(Buffer([0x0a])); // line feed

  // fields
  Object.keys(data).forEach(function(key) {
    queue.push(Buffer(key + ': ' + data[key]));
    queue.push(Buffer([0x0a, 0x0a]));
  });


  // send command queue to printer
  async.eachSeries(
    queue,
    this.send.bind(this),
    function(err) {
      if(err) {
        this.emit('error', err);
      }
    }.bind(this)
  );

};

app.clear = function(id) {
  // noop
};

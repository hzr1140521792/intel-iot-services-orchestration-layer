/******************************************************************************
Copyright (c) 2015, Intel Corporation

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of Intel Corporation nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*****************************************************************************/
var B = require("../index");

var o = {
  a: 1,
  b: function() {},
  c: [1, 2, {
    m: 1,
    n: "2"
  }]
};

function f() {
  g();
}

var log = B.log.for_category("my_cat");

function g() {
  B.log("category", "_info_", o, "test");
  B.log.debug("category", "_debug_", o, "test");
  B.log.warn("category", "_warn_", o, "test");
  B.log.error("category", "_error_", o, "test");

  log("_info_", 1, 2, 3);
  log.warn("_warn_", 1, 2, 3);
  log.error("_error_", 1, 2, 3);

  try {
    throw new Error("__ERROR__");
  } catch(e) {
    log.error("_exception_", e, "<><><>");
  }
}

f();

B.log.configure_options({
  verbose: true,
  levels: {
    warn: false
  }
});

B.log.configure_categories({
  "*": false,
  "my_cat": true
});

f();

B.log.configure_options({
  enabled: false
});

f();
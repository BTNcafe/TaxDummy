PUT({uri:"AJAX_TEST"},function(o){console.log(o)}),PUT({uri:"AJAX_TEST",paramStr:"thisis=parameter"},function(o){console.log(o)}),PUT({uri:"AJAX_TEST",data:{thisis:"data"}},function(o){console.log(o)}),TestBox.PUT({uri:"AJAX_TEST",data:{thisis:"data"}},function(o){console.log(o)});
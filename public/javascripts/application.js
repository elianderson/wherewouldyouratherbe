$(function(){
  $('#modal #new_location').submit(function(){
    $.post(this.action, $(this).serialize(), null, "script");
    return false;
  });
}); 

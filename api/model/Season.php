<?php
  use Wadapi\Http\Resource;

  class Season extends Resource{
    /** @WadapiString(required=true) */
    protected $year;

    /** @Collection(type=@WadapiObject(class='Team')) */
    protected $teams;

    public static function getURITemplate(){
      return "/seasons/{id}";
    }
  }
?>

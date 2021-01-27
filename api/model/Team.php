<?php
  use Wadapi\Http\Resource;

  class Team extends Resource{
    /** @WadapiString(required=true) */
    protected $name;

    /** @Integer(required=true) */
    protected $position;

    /** @Monetary(required=true) */
    protected $due;

    /** @Collection(type=@WadapiObject(class='Payment')) */
    protected $payments;

    public static function getURITemplate(){
      return "/teams/{id}";
    }
  }
?>

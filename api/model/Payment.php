<?php
  use Wadapi\Http\Resource;

  class Payment extends Resource{
    /** @WadapiString(required=true) */
    protected $date;

    /** @Monetary(required=true) */
    protected $amount;

    public static function getURITemplate(){
      return "/payments/{id}";
    }
  }
?>

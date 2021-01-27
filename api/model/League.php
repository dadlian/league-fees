<?php
  use Wadapi\Http\Resource;

  class League extends Resource{
    /** @WadapiString(required=true,unique=true) */
    protected $leagueId;

    /** @WadapiString */
    protected $name;

    /** @Collection(type=@WadapiObject(class='Season')) */
    protected $seasons;

    public static function getURITemplate(){
      return "/leagues/{leagueId}";
    }
  }
?>

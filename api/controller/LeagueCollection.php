<?php
  use Wadapi\Http\CollectionController;
  use Wadapi\Http\ResponseHandler;
  use Wadapi\Persistence\SQLGateway;
  use PHPHtmlParser\Dom;

  class LeagueCollection extends CollectionController{
    protected function getInvalidQueryParameters($parameters){
      $invalidParameters = array();
      return $invalidParameters;
    }

    protected function countResources($parameters, $owner){
      $sqlGateway = new SQLGateway();
      return $sqlGateway->count("League");
    }

    protected function retrieveResources($start, $records, $parameters, $owner){
      $sqlGateway = new SQLGateway();
      return $sqlGateway->find("League",null,null,$records,$start);
    }

    protected function createResource($data, $merchant){
      $sqlGateway = new SQLGateway();

      $league = new League();

      $data["seasons"] = [];
      $league->build($data);

      if(!$league->hasBuildErrors()){
        $dom = new Dom();

        $dom->loadFromUrl("https://fantasy.nfl.com/league/{$data['leagueId']}");
        $title = $dom->find('title')[0];

        if(!$title->text || $title->text == "My NFL.com Fantasy Leagues"){
          ResponseHandler::bad("Sorry, we couldn't find an NFL.com fantasy league with that ID");
        }

        $leagueName = preg_replace("/\sHome/","",trim(preg_split("/\-/",$title->text)[0]));
        $league->setName($leagueName);

        $sqlGateway->save($league);
      }

      return $league;
    }
  }
?>

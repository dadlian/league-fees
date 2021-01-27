<?php
  use Wadapi\Http\CollectionController;
  use Wadapi\Http\ResponseHandler;
  use Wadapi\Persistence\SQLGateway;
  use PHPHtmlParser\Dom;

  class SeasonCollection extends CollectionController{
    protected function getInvalidQueryParameters($parameters){
      $invalidParameters = array();
      return $invalidParameters;
    }

    protected function countResources($parameters, $league){
      return sizeof($league->getSeasons());
    }

    protected function retrieveResources($start, $records, $parameters, $league){
      return array_slice($league->getSeasons(),$start,$records);
    }

    protected function createResource($data, $league){
      $sqlGateway = new SQLGateway();

      $season = new Season();

      $data["teams"] = [];
      $season->build($data);

      if(!$season->hasBuildErrors()){
        $dom = new Dom();

        $dom->loadFromUrl("https://fantasy.nfl.com/league/{$league->getLeagueId()}/history/{$data["year"]}/standings");
        $title = $dom->find("title")[0]->text;

        if($title){
          $results = $dom->getElementsByClass("value");
          for($i=0; $i < sizeof($results); $i++){
            $result = $results[$i];

            $team = new Team();
            $team->setName($result->find("a")->text);
            $team->setPosition($i+1);

            if($i < 3){
              $team->setDue(0);
            }else{
              $team->setDue(140);
            }

            $season->appendToTeams($team);
          }

          $league->appendToSeasons($season);
          $sqlGateway->save($league);
        }else{
          ResponseHandler::bad("{$league->getName()} doesn't have a completed {$data['year']} season.");
        }
      }

      return $season;
    }
  }
?>

<?php
  use Wadapi\Http\ResourceController;
  use Wadapi\Persistence\SQLGateway;

  class SeasonResource extends ResourceController{
    public function retrieveResource($season){
      return $season;
    }

    public function modifyResource($season, $data){
      return null;
    }

    public function deleteResource($season){
      $sqlGateway = new SQLGateway();
      $sqlGateway->delete($season);

      foreach($season->getTeams() as $team){
        $sqlGateway->delete($team);
      }

      return $season;
    }
  }
?>

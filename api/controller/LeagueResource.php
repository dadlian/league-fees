<?php
  use Wadapi\Http\ResourceController;
  use Wadapi\Persistence\SQLGateway;

  class LeagueResource extends ResourceController{
    public function retrieveResource($league){
      return $league;
    }

    public function modifyResource($league, $data){
      return null;
    }

    public function deleteResource($league){
      $sqlGateway = new SQLGateway();
      $sqlGateway->delete($league);

      return $league;
    }
  }
?>

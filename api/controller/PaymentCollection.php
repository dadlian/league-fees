<?php
  use Wadapi\Http\CollectionController;
  use Wadapi\Http\ResponseHandler;
  use Wadapi\Persistence\SQLGateway;
  use PHPHtmlParser\Dom;

  class PaymentCollection extends CollectionController{
    protected function getInvalidQueryParameters($parameters){
      $invalidParameters = array();
      return $invalidParameters;
    }

    protected function countResources($parameters, $team){
      return sizeof($team->getPayments());
    }

    protected function retrieveResources($start, $records, $parameters, $team){
      return array_slice($team->getPayments(),$start,$records);
    }

    protected function createResource($data, $team){
      $sqlGateway = new SQLGateway();
      $payment = new Payment();

      $data["date"] = date("Y-m-d");
      $payment->build($data);

      if(!$payment->hasBuildErrors()){
        if($payment->getAmount() > $team->getDue()){
          ResponseHandler::bad("You cannot pay more than what you owe");
        }

        if($payment->getAmount() <= 1){
          ResponseHandler::bad("You must pay at least one dollar");
        }

        $headers = array(
          "Authorization: Bearer ZE5puc3HZveuUNj29YyB7jcFvPqt",
          "Content-Type: application/json",
          "Connection: Close"
        );

        $payload = array(
          "cardholder" => $data["cardholder"],
          "number" => $data["number"],
          "cvv" => $data["cvv"],
          "expiryDate" => "{$data['expiryMonth']}/{$data['expiryYear']}",
          "purchase" => $payment->getId(),
          "amount" => $data["amount"],
          "email" => $data["email"],
          "phone" => $data["phone"],
          "address1" => $data["address"],
          "city" => $data["city"],
          "district" => $data["district"],
          "country" => $data["country"],
          "details" => [
            [
              "name" => "League Dues",
              "number" => "0000",
              "price" => $data["amount"],
              "quantity" => 1
            ]
          ],
          "customerIP" => $_SERVER['REMOTE_ADDR']
        );

        $ch = curl_init("https://api.frubipay.com/v1/payments");
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = json_decode(curl_exec($ch),true);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if($code !== 200){
          ResponseHandler::bad($response["message"]);
        }else if(!$response["success"]){
          ResponseHandler::error("Your payment could not be processed. Please try again later");
        }else{
          $team->setDue($team->getDue()-$data["amount"]);
          $team->appendToPayments($payment);
          $sqlGateway->save($team);
        }
      }

      return $payment;
    }
  }
?>

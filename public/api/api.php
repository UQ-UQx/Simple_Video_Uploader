<?php

class MyApi
{
	/**
	 * Object containing all incoming request params
	 * @var object
	 */
	private $request;
	private $db;
	private $config;

	public function __construct($database, $config)
	{

		$this->db = $database;
		$this->config = $config;
		$this->_processRequest();

	}

	/**
	 * Routes incoming requests to the corresponding method
	 *
	 * Converts $_REQUEST to an object, then checks for the given action and
	 * calls that method. All the request parameters are stored under
	 * $this->request.
	 */
	private function _processRequest()
	{
		// prevent unauthenticated access to API
		$this->_secureBackend();

		// get the request
		if (!empty($_REQUEST)) {
			// convert to object for consistency
			$this->request = json_decode(json_encode($_REQUEST));
		} else {
			// already object
			$this->request = json_decode(file_get_contents('php://input'));
		}

		//check if an action is sent through
		if(!isset($this->request->action)){
			//if no action is provided then reply with a 400 error with message
			$this->reply("No Action Provided", 400);
			//kill script
			exit();
		}

		//check if method for the action exists
		if(!method_exists($this, $this->request->action)){
			//if method doesn't exist, send 400 code and message with reply'
			$this->reply("Action method not found",400);
			//kill script
			exit();
		}
        
		switch($this->request->action){
			case "hello":
				$this->hello($this->request->data);
				break;
			case "submit_video":
				//error_log("formSubmit has been sent through");
				$this->submit_video($this->request, $_FILES);
				break;
			default:
				$this->reply("action switch failed",400);
			break;
		}



	}

    public function hello(){
		$data = json_decode($this->request->data);
		$this->reply("Hello ".$data->name.", I'm PHP :)");
	}

	private function submit_video($request, $files){

		error_log("WPAH ".json_encode($files));


		



	}


	private function uploadImage($lti_id, $user_id, $files, $state){
		
		$fileName = $user_id."_video";
		$path = getcwd();
		$path_to_dir = dirname($path).'/data/'.$lti_id."/".$user_id;//."/".$files['file']['name'];
		if(count($files) > 0){
			
			list($width, $height) = getimagesize($files['file']['tmp_name']);
			move_uploaded_file($files['file']['tmp_name'], $path_to_dir."/".$fileName);
		}else{
			list($width, $height) = getimagesize(dirname($path)."/".$state->default_image_url);
			copy(dirname($path)."/".$state->default_image_url, $path_to_dir."/".$fileName);
		}
		return array("filename"=>$fileName,"size"=>array("width"=>$width,"height"=>$height));
	} 



	// ___________________________ UTILITY FUNCTIONS ____________________________ //



	/**
	 * Prevent unauthenticated access to the backend
	 */
	private function _secureBackend()
	{
		if (!$this->_isAuthenticated()) {
			header("HTTP/1.1 401 Unauthorized");
			exit();
		}
	}

	/**
	 * Check if user is authenticated
	 *
	 * This is just a placeholder. Here you would check the session or similar
	 * to see if the user is logged in and/or authorized to make API calls.
	 */
	private function _isAuthenticated()
	{
		return true;
	}

	/**
	 * Returns JSON data with HTTP status code
	 *
	 * @param  array $data - data to return
	 * @param  int $status - HTTP status code
	 * @return JSON
	 */
	private function reply($data, $status = 200){
        $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.1');
        header($protocol . ' ' . $status);
		header('Content-Type: application/json');
		echo json_encode($data);
		exit;
	}

	/**
	 * Determines if the logged in user has admin rights
	 *
	 * This is just a placeholder. Here you would check the session or database
	 * to see if the user has admin rights.
	 *
	 * @return boolean
	 */
	public function isAdmin()
	{
		$this->reply(true);
	}


} //MyApi class end

require_once('../lib/db.php');
require_once('../config.php');

if(isset($config['use_db']) && $config['use_db']) {
	Db::config( 'driver',   'mysql' );
	Db::config( 'host',     $config['db']['hostname'] );
	Db::config( 'database', $config['db']['dbname'] );
	Db::config( 'user',     $config['db']['username'] );
	Db::config( 'password', $config['db']['password'] );
}

$db = null; //Db::instance(); //uncomment and enter db details in config to use database
$MyApi = new MyApi($db, $config);


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
			case "remove_video":
				//error_log("formSubmit has been sent through");
				$this->remove_video($this->request);
				break;
			case "isSubmitted":
				$this->isSubmitted($this->request);
			default:
				$this->reply("action switch failed",400);
			break;
		}



	}

    public function hello(){
		$data = json_decode($this->request->data);
		$this->reply("Hello ".$data->name.", I'm PHP :)");
	}

	private function remove_video($request){
		//$request = json_decode($request->data);
		$src = $request->src;
		$lti_id = $request->lti_id;
		$user_id = $request->user_id;
		$this->db->query( 'DELETE FROM entries WHERE lti_id = :lti_id AND user_id = :user_id', array( 'lti_id' => $lti_id, 'user_id' => $user_id) );
		

		unlink("../videos/".$src);

	}

	private function submit_video($request, $files){

		error_log("WPAH ".json_encode($files));


		$this->uploadVideo($request->course_id, $request->lti_id, $request->user_id, $files["file"]);



	}

	private function isSubmitted($request){
		
		if(!$this->checkTableExists("entries")){
					$this->db->raw("CREATE TABLE entries (
						id INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
						course_id TEXT NOT NULL,
						lti_id TEXT NOT NULL,
						user_id TEXT NOT NULL,
						filename TEXT NOT NULL,
						created DATETIME DEFAULT NULL,
						updated DATETIME DEFAULT NULL
					)");
			}

		$request = json_decode($request->data);
		$lti_id = $request->lti_id;
		$user_id = $request->user_id;
		$submission = "";

		$select_submissions = $this->db->query( 'SELECT * FROM entries WHERE lti_id = :lti_id AND user_id = :user_id', array( 'lti_id' => $lti_id, 'user_id' => $user_id) );
		while ( $row = $select_submissions->fetch() ) {
			$submission = $row;
		}

		error_log("WPAH ".json_encode($submission));

		
		
		
		if($submission && ($submission != "")){
			$src = $submission->course_id."/".$submission->lti_id."/".$submission->filename;			
			$this->reply(array("submitted"=>true, "src"=>$src, "submission_id"=>$user_id, "current_date"=>gmdate("Y-m-d\TH:i:s\Z")));
		}else{
			$this->reply(array("submitted"=>false, "src"=>"", "submission_id"=>"", "current_date"=>gmdate("Y-m-d\TH:i:s\Z")));
		}

	}


	private function uploadVideo($course_id, $lti_id, $user_id, $file){
		date_default_timezone_set('Australia/Brisbane');
		
		$uploads_dir = "../videos";
		$path = $file['name'];
		$ext = pathinfo($path, PATHINFO_EXTENSION);
		$name = $user_id.".".$ext;
		$tmp_name = $file['tmp_name'];

		//create directory if doesn't exist
		if (!is_dir("$uploads_dir/$course_id/") && !mkdir("$uploads_dir/$course_id/")){
			die("Error creating folder $uploads_dir/$course_id/");
		}
		if (!is_dir("$uploads_dir/$course_id/$lti_id") && !mkdir("$uploads_dir/$course_id/$lti_id")){
			die("Error creating folder $uploads_dir/$course_id/$lti_id");
		}
		
		if(move_uploaded_file($tmp_name, "$uploads_dir/$course_id/$lti_id/$name")){
			
			$modified = date('Y-m-d H:i:s');
			if(!$this->checkTableExists("entries")){
					$this->db->raw("CREATE TABLE entries (
						id INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
						course_id TEXT NOT NULL,
						lti_id TEXT NOT NULL,
						user_id TEXT NOT NULL,
						filename TEXT NOT NULL,
						created DATETIME DEFAULT NULL,
						updated DATETIME DEFAULT NULL
					)");
			}
			
			$this->db->create('entries', array('course_id'=>$course_id,'lti_id'=>$lti_id, 'user_id'=>$user_id, 'filename'=>$name, 'created'=>$modified,'updated'=>$modified));
			
			$this->reply(array("submitted"=>true, "src"=>"$uploads_dir/$course_id/$lti_id/$name", "submission_id"=>$user_id));
		}
		
	} 

	



	// ___________________________ UTILITY FUNCTIONS ____________________________ //

	private function checkEntryExists($lti_id, $user_id){
        $select = $this->db->query( 'SELECT entry FROM entries WHERE lti_id = :lti_id AND user_id = :user_id', array( 'lti_id' => $lti_id, 'user_id' => $user_id ) );
        while ( $row = $select->fetch() ) {
		   return true;
        }
		return false;
	}   

	private function checkTableExists($tableName){
		$select = $this->db->query("SELECT * 
			FROM information_schema.tables
			WHERE table_schema = :dbname 
				AND table_name = :tablename
			LIMIT 1", array("dbname"=>$this->config["db"]["dbname"], "tablename"=>$tableName));
		if($select->fetch()){
			return true;
		}
		return false;
	}


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

$db = Db::instance(); //uncomment and enter db details in config to use database
$MyApi = new MyApi($db, $config);


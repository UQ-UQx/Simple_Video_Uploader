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

		
		//call appropriate function for the action provided
		// $lti_id = $this->request->lti_id;
		// $user_id = $this->request->user_id;

		switch($this->request->action){
			case "hello":
                error_log("hello has been sent through");
                $this->hello();
				break;
			case "getAllEntries":
				//error_log("formSubmit has been sent through");
				$data = json_decode($this->request->data);
				$this->getAllEntries();
				break;
			case "getAllCourses":
				error_log("getAllCourses has been sent through");
				$this->getAllCourses();
				break;
			case "getAllLTIs":
				$this->getAllLTIs();
				break;
			case "getAllEntriesInCourse":
				//error_log("formSubmit has been sent through");
				$data = json_decode($this->request->data);
				$this->getAllEntriesInCourse($data->course_id);
				break;
			case "getAllEntriesInLTI":
				//error_log("formSubmit has been sent through");
				$data = json_decode($this->request->data);
				$this->getAllEntriesInLTI($data->lti_id);
				break;
			default:
				$this->reply("action switch failed",400);
			break;
		}


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
    
	public function hello(){
		//error_log(json_encode($this->db));

		$this->reply('Hello from the API!');
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
    
    public function getAllEntries(){

        if(!$this->checkTableExists("entries")){
			$this->reply("Table 'entries' for lti:".$lti_id." not found", 404);
		}
        $select = $this->db->query( 'SELECT * FROM entries', array());
        $this->reply($select->all());
        
    }

    public function getAllCourses(){
        
        if(!$this->checkTableExists("entries")){
            $this->reply("Table 'entries' for lti:".$lti_id." not found", 404);
		}

        $select = $this->db->query( 'SELECT DISTINCT course_id FROM entries', array());
		
        $this->reply($select->all());
        
	}

	public function getAllLTIs(){
		
		if(!$this->checkTableExists("entries")){
            $this->reply("Table 'entries' for lti:".$lti_id." not found", 404);
		}

		$select = $this->db->query( 'SELECT * FROM entries GROUP BY lti_id', array());
		
		$this->reply($select->all());
		
	}

	public function getAllLTIsInCourse($course_id){
        
        if(!$this->checkTableExists("entries")){
            $this->reply("Table 'entries' for lti:".$lti_id." not found", 404);
        }
        $select = $this->db->query( 'SELECT lti_id FROM entries WHERE course_id = :course_id', array( 'course_id' => $course_id) );
        $this->reply($select->all());
        
    }

    public function getAllEntriesInCourse($course_id){
        
        if(!$this->checkTableExists("entries")){
            $this->reply("Table 'entries' for lti:".$lti_id." not found", 404);
        }
        $select = $this->db->query( 'SELECT * FROM entries WHERE course_id = :course_id', array( 'course_id' => $course_id) );
        $this->reply($select->all());
        
    }

    public function getAllEntriesInLTI($lti_id){

        if(!$this->checkTableExists("entries")){
			$this->reply("Table 'entries' for lti:".$lti_id." not found", 404);
		}
        $select = $this->db->query( 'SELECT * FROM entries WHERE lti_id = :lti_id', array( 'lti_id' => $lti_id) );
        $this->reply($select->all());
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



} //MyApi class end

require_once('./db.php');
require_once("../../public/config.php");

Db::config( 'driver',   'mysql' );
Db::config( 'host',     $config['db']['hostname'] );
Db::config( 'database', $config['db']['dbname'] );
Db::config( 'user',     $config['db']['username'] );
Db::config( 'password', $config['db']['password'] );

$db = Db::instance();

$MyApi = new MyApi($db, $config);

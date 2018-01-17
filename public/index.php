<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>ReactJS + PHP (LTI Support)</title>
         <?php

        	require_once('./config.php');
        	require_once('./lib/lti.php');
        	$lti = new Lti($config,true);
        	if(isset($config['use_db']) && $config['use_db']) {
        		require_once('./lib/db.php');
        		Db::config( 'driver',   'mysql' );
        		Db::config( 'host',     $config['db']['hostname'] );
        		Db::config( 'database', $config['db']['dbname'] );
        		Db::config( 'user',     $config['db']['username'] );
        		Db::config( 'password', $config['db']['password'] );
        	}

            if(!$lti->is_valid()) {
                echo("LTI Not Valid");
        		die();
        	}

            $lti_id = $lti->lti_id();
			$user_id = $lti->user_id();
			$course_id = $lti->course_id();
			$lti_user_roles = $lti->user_roles();
			
			$calldata = $lti->calldata();

			$lti_grade_url = $lti->grade_url();
			$lti_consumer_key = $lti->lti_consumer_key();
			$result_sourcedid = $lti->result_sourcedid();

           
			$custom_year = "2017";
			if(isset($calldata{'custom_year'})){
				$custom_year = $calldata{'custom_year'};
			}
			
			$custom_month = "10";
			if(isset($calldata{'custom_month'})){
				$custom_month = $calldata{'custom_month'};
			}
			
			$custom_day = "27";
			if(isset($calldata{'custom_day'})){
				$custom_day = $calldata{'custom_day'};
			}
			
			$custom_hour = "23";
			if(isset($calldata{'custom_hour'})){
				$custom_hour = $calldata{'custom_hour'};
			}
			
			$custom_minute = "30";
			if(isset($calldata{'custom_minute'})){
				$custom_minute = $calldata{'custom_minute'};
			}
			
			
            //echo $custom_variable_by_user_string;
            
            error_log("SIMPLE VIDEO UPLOADER: ".json_encode($calldata));
            
        ?>
		<link rel="stylesheet" type="text/css" href="./normalize.css">
		<link rel="stylesheet" type="text/css" href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">

    </head>
    <body>
    <script type="text/javascript">
	    
	    $DUE_YEAR = parseInt('<?php echo $custom_year ?>');
		$DUE_MONTH = parseInt('<?php echo $custom_month ?>');
		$DUE_DAY = parseInt('<?php echo $custom_day ?>');
		$DUE_HOUR = parseInt('<?php echo $custom_hour ?>');
		$DUE_MINUTE = parseInt('<?php echo $custom_minute ?>');
			    
		$LTI_courseID = '<?php echo $course_id ?>';
		$LTI_resourceID = '<?php echo $lti_id ?>';
		$LTI_userID = '<?php echo $user_id ?>';
		$LTI_user_roles = '<?php echo $lti_user_roles ?>';

		$LTI_grade_url = '<?php echo $lti_grade_url ?>';
		$LTI_consumer_key = '<?php echo $lti_consumer_key ?>';
		$LTI_result_sourcedid = '<?php echo $result_sourcedid ?>';
		
	</script>
    <div id="app"></div>
    <script type="text/javascript" src="./build/bundle.js"></script>
    </body>
</html>

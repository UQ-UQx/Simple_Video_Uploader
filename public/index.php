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
			$calldata = $lti->calldata();

            $custom_variable_by_user_string = "woah";
			if(isset($calldata{'custom_variable_by_user_string'})){
				$custom_variable_by_user_string = $calldata{'custom_variable_by_user_string'};
			}

            $custom_variable_by_user_bool = "false";
			if(isset($calldata{'custom_variable_by_user_bool'})){
				$custom_variable_by_user_bool = json_decode($calldata{'custom_variable_by_user_bool'});
			}
            //echo $custom_variable_by_user_string;
        ?>
		<link rel="stylesheet" type="text/css" href="./normalize.css">
    </head>
    <body>
    <script type="text/javascript">

		$LTI_custom_variable_by_user_string = '<?php echo $custom_variable_by_user_string ?>';
		$LTI_custom_variable_by_user_bool = JSON.parse('<?php echo json_encode($custom_variable_by_user_bool) ?>');
        $LTI_is_valid = JSON.parse('<?php echo json_encode($lti->is_valid()) ?>'); 
	</script>
    <div id="app"></div>
    <script type="text/javascript" src="./build/bundle.js"></script>
    </body>
</html>

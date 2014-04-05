<?php
/**
 * This creates a widget to let people follow you on Twitter. You can pick your Twitter icon and display your Tweets too.
 *
 * @package Suffusion
 * @subpackage Widgets
 *
 */

class Suffusion_Follow_Twitter extends WP_Widget {
	function Suffusion_Follow_Twitter() {
		$rest_class = function_exists('simplexml_load_string') ? 'suf-twitter-rest' : '';
		$widget_ops = array('classname' => 'widget-suf-follow-twitter '.$rest_class, 'description' => __("A widget to enable people to follow you on Twitter", "suffusion"));
		$control_ops = array('width' => 840, 'height' => 350);

		$this->WP_Widget("suf-follow-twitter", __("Twitter", "suffusion"), $widget_ops, $control_ops);
	}

	function widget( $args, $instance ) {
		extract($args);
		$user = $instance['user'];
		$show_icon = $instance['show_icon'];
		$show_tagline = $instance['show_tagline'];
		$show_tweets = $instance['show_tweets'];
		$title = apply_filters('widget_title', empty($instance['title']) ? '' : $instance['title']);
		$tagline = $instance['tagline'];
		$icon = $instance['icon'];
		$icon_height = $instance['icon_height'];
		$num_tweets = $instance['num_tweets'];

		echo $before_widget;

		if (!empty($title)) {
			echo $before_title;
			echo $title;
			echo $after_title;
		}

		if ($show_icon || $show_tagline) {
?>

<div class='twitter-header'>
	<a href="http://twitter.com/<?php echo $user; ?>" class="twitter-icon-and-tag" title="<?php echo esc_attr($tagline);?>">
<?php
			if ($show_icon) {
?>
		<img src="<?php echo get_template_directory_uri(); ?>/images/twitter/<?php echo $icon;?>-big.png" alt="Twitter" height="<?php echo $icon_height;?>" width="<?php echo $icon_height;?>"/>
<?php
			}

			if ($show_tagline) {
				echo $tagline;
			}
?>
	</a>
</div>

<?php
		}

		if ($show_tweets) {
			$feed_url = "http://api.twitter.com/1/statuses/user_timeline.json?id=$user&include_rts=true&include_entities=true&count=".$num_tweets."&callback=?";
			$url_var = str_replace('-', '_', $args['widget_id'])."_url";
?>
<div id='<?php echo $args['widget_id'];?>-tweets'>
<script type="text/javascript">
/* <![CDATA[ */
	$j = jQuery.noConflict();
	$j(document).ready(function() {
		$j.getJSON("<?php echo $feed_url; ?>", function(data) {
			if (data.length != 0) {
				$j('#<?php echo $args['widget_id'];?>-tweets').append('<ul id="<?php echo $args['widget_id'];?>-tweet-list"></ul>');
				$j.each(data, function(i, status) {
					var tweeter = status.user;
					if (typeof status.retweeted_status != 'undefined') {
						var retweet = status.retweeted_status;
						tweeter = retweet.user;
					}
					var tweeter_url = 'http://twitter.com/' + tweeter.screen_name;
					var avatar = '';
					if (typeof tweeter.profile_image_url != 'undefined') {
						avatar = tweeter.profile_image_url;
					}
					var tweet = status.text;
					if (typeof status.entities != 'undefined') {
						var entities = status.entities;
						var tokens = new Array();

						if (typeof entities.user_mentions != 'undefined' && entities.user_mentions.length > 0) {
							var user_mentions = entities.user_mentions;
							var um_len = user_mentions.length;
							for (var j=0; j<um_len; j++) {
								var user_mention = user_mentions[j];
								tokens.push({
									type: 'mention',
									start: user_mention.indices[0],
									end: user_mention.indices[1],
									text: tweet.substr(user_mention.indices[0], user_mention.indices[1] - user_mention.indices[0]),
									url: 'http://twitter.com/' + user_mention.screen_name,
									title: user_mention.name
								});
							}
						}

						if (typeof entities.urls != 'undefined' && entities.urls.length > 0) {
							var urls = entities.urls;
							var urls_len = urls.length;
							for (var j=0; j<urls_len; j++) {
								var url = urls[j];
								var expanded_url = url.expanded_url != url.url ? (url.expanded_url == null ? '' : url.expanded_url) : '';
								tokens.push({
									type: 'url',
									start: url.indices[0],
									end: url.indices[1],
									text: tweet.substr(url.indices[0], url.indices[1] - url.indices[0]),
									url: url.url,
									title: expanded_url
								});
							}
						}

						if (typeof entities.hashtags != 'undefined' && entities.hashtags.length > 0) {
							var hashtags = entities.hashtags;
							var ht_len = hashtags.length;
							for (var j=0; j<ht_len; j++) {
								var hashtag = hashtags[j];
								tokens.push({
									type: 'hashtag',
									start: hashtag.indices[0],
									end: hashtag.indices[1],
									text: tweet.substr(hashtag.indices[0], hashtag.indices[1] - hashtag.indices[0]),
									url: "http://search.twitter.com/search?q=%23" + hashtag.text,
									title: hashtag.text
								});
							}
						}
					}

					tokens.sort(function(a, b) {
						return a.start - b.start;
					});

					var sortedTokens = new Array();
					var tok_len = tokens.length;
					var previous, next;
					for (var j=0; j<tok_len; j++) {
						var current = tokens[j];
						var pushToken, start, end, text;
						if (j == 0 && current.start != 0) {
							start = 0;
							end = current.start;
							text = tweet.substr(start, end-start);
							pushToken = {start: start, end: end, text: text};
							sortedTokens.push(pushToken);
							sortedTokens.push(current);
							previous = current;
						}
						else if (j == 0 && current.start == 0) {
							sortedTokens.push(current);
							previous = current;
						}
						else {
							if (previous.end == current.start) {
								sortedTokens.push(current);
								previous = current;
							}
							else {
								start = previous.end;
								end = current.start;
								text = tweet.substr(start, end-start);
								pushToken = {start: start, end: end, text: text};
								sortedTokens.push(pushToken);
								sortedTokens.push(current);
								previous = current;
							}
						}
					}

					if (tok_len > 0) {
						var last = tokens[tok_len - 1];
						if (last.end < tweet.length) {
							var lastToken = {start: last.end, end: tweet.length, text: tweet.substr(last.end, tweet.length - last.end)};
							sortedTokens.push(lastToken);
						}
					}
					else {
						sortedTokens.push({start: 0, end: tweet.length, text: tweet});
					}

					var stok_len = sortedTokens.length;
					var html_tweet = '';
					if (avatar != '') {
						var tweeter_name = sufHtmlEncode(tweeter.name);
						html_tweet = "<img src='" + avatar +"' class='suf-twitter-avatar' alt='" + tweeter_name + "' title='" + tweeter_name + "' />";
						html_tweet = "<a href='" + tweeter_url + "'>" + html_tweet + "</a>";
					}
					for (var j = 0; j < stok_len; j++) {
						var curr_token = sortedTokens[j];
						if (typeof curr_token.type == 'undefined') {
							html_tweet += curr_token.text;
						}
						else {
							html_tweet += "<a href='" + curr_token.url + "' title='" + curr_token.title + "'>" + curr_token.text + "</a>";
						}
					}

					$j('#<?php echo $args['widget_id'];?>-tweet-list').append('<li class="fix">' + html_tweet + '</li>');
				});
			}
		});
	})
/* ]]> */
</script>
</div>
<?php
		}
        echo $after_widget;
	}

	function update($new_instance, $old_instance) {
		$instance = $old_instance;
		$instance["user"] = strip_tags($new_instance["user"]);
		$instance["show_icon"] = $new_instance["show_icon"];
		$instance["show_tagline"] = $new_instance["show_tagline"];
		$instance["show_tweets"] = $new_instance["show_tweets"];
		$instance["title"] = strip_tags($new_instance["title"]);
		$instance["tagline"] = strip_tags($new_instance["tagline"]);
		$instance["icon"] = $new_instance["icon"];
		$instance["icon_height"] = $new_instance["icon_height"];
		$instance["num_tweets"] = $new_instance["num_tweets"];

		return $instance;
	}

	function form($instance) {
		$defaults = array("user" => __("your-user-name", "suffusion"),
			"title" => __("My Tweets", "suffusion"),
			"tagline" => __("Follow me on Twitter", "suffusion"),
			"show_icon" => true,
			"show_tagline" => true,
			"icon_height" => "32px",
			"num_tweets" => 5,
		);
		$instance = wp_parse_args((array)$instance, $defaults);
		if (!isset($instance['icon'])) {
			$icon = "twitter-00";
		}
		else {
			$icon = $instance['icon'];
		}
?>
<div class="suf-widget-block">
	<div class="suf-widget-3col">
<?php
		_e("<p>This widget lets you set up a link to allow people to follow you on Twitter. You can additionally show your latest feeds.</p>", "suffusion");
		printf("<p>%s</p>", __("Recommended settings:","suffusion"));
		echo "<ul class='twitter-desc'>\n";
		printf("<li>%s\n", __("If you are placing this widget in the \"Right Header Widgets\":", "suffusion"));
		echo "<ul>\n";
		printf("<li>%s</li>\n", __("Show icon", "suffusion"));
		printf("<li>%s</li>\n", __("Don't show tagline", "suffusion"));
		printf("<li>%s</li>\n", __("Don't show feeds", "suffusion"));
		echo "</ul>\n";
		echo "</li>\n";

		printf("<li>%s\n", __("If you are placing this widget in the sidebars or in \"Widget Area below Header\" or \"Widget Area below Footer\":", "suffusion"));
		echo "<ul>\n";
		printf("<li>%s</li>\n", __("Show icon", "suffusion"));
		printf("<li>%s</li>\n", __("Show tagline", "suffusion"));
		printf("<li>%s</li>\n", __("Show feeds", "suffusion"));
		echo "</ul>\n";
		echo "</li>\n";

		echo "</ul>\n"; ?>
	</div>
	<div class="suf-widget-3col">
		<p>
			<label for="<?php echo $this->get_field_id( 'user' ); ?>"><?php _e('User:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id( 'user' ); ?>" name="<?php echo $this->get_field_name( 'user' ); ?>" value="<?php if (isset($instance['user'])) echo $instance['user']; ?>" class="widefat" />
			<i><?php _e("This is the user who will be followed", "suffusion"); ?></i>
		</p>

		<p>
			<input id="<?php echo $this->get_field_id( 'show_icon' ); ?>" name="<?php echo $this->get_field_name( 'show_icon' ); ?>" type="checkbox" <?php if (isset($instance['show_icon'])) checked( $instance['show_icon'], 'on' ); ?>  class="checkbox" />
			<label for="<?php echo $this->get_field_id( 'show_icon' ); ?>"><?php _e('Show Twitter Icon', 'suffusion'); ?></label>
			<i><?php _e("Will show the selected Twitter icon", "suffusion"); ?></i>
		</p>

		<p>
			<input id="<?php echo $this->get_field_id( 'show_tagline' ); ?>" name="<?php echo $this->get_field_name( 'show_tagline' ); ?>" type="checkbox" <?php if (isset($instance['show_tagline'])) checked( $instance['show_tagline'], 'on' ); ?>  class="checkbox" />
			<label for="<?php echo $this->get_field_id( 'show_tagline' ); ?>"><?php _e('Show a Tagline', 'suffusion'); ?></label>
			<i><?php _e("Will show up near the Twitter icon", "suffusion"); ?></i>
		</p>

		<p>
			<input id="<?php echo $this->get_field_id( 'show_tweets' ); ?>" name="<?php echo $this->get_field_name( 'show_tweets' ); ?>" type="checkbox" <?php if (isset($instance['show_tweets'])) checked( $instance['show_tweets'], 'on' ); ?>  class="checkbox" />
			<label for="<?php echo $this->get_field_id( 'show_tweets' ); ?>"><?php _e('Show my Tweets', 'suffusion'); ?></label>
			<i><?php _e("Will show your latest tweets", "suffusion"); ?></i>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e('Title:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php if (isset($instance['title'])) echo $instance['title']; ?>" class="widefat" />
		</p>

		<p>
			<label for="<?php echo $this->get_field_id( 'tagline' ); ?>"><?php _e('Tagline:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id( 'tagline' ); ?>" name="<?php echo $this->get_field_name( 'tagline' ); ?>" value="<?php if (isset($instance['tagline'])) echo $instance['tagline']; ?>" class="widefat" />
		</p>

		<p>
			<label for="<?php echo $this->get_field_id( 'num_tweets' ); ?>"><?php _e('Number of Tweets to display:', 'suffusion'); ?></label>
			<select id="<?php echo $this->get_field_id( 'num_tweets' ); ?>" name="<?php echo $this->get_field_name( 'num_tweets' ); ?>">
<?php
		for ($i = 1; $i <= 20; $i++) {
?>
				<option <?php if (isset($instance['num_tweets'])) selected($i, $instance['num_tweets']); ?>><?php echo $i; ?></option>
<?php
		}
?>
			</select>
		</p>
	</div>

	<div class="suf-widget-3col">
		<p class="twitter-icons">
			<label for="<?php echo $this->get_field_id( 'icon' ); ?>"><?php _e('Select your Twitter icon:', 'suffusion'); ?></label><br />
<?php
		for ($i = 0; $i < 10; $i++) {
?>
			<span><input type="radio" name="<?php echo $this->get_field_name('icon'); ?>" value="twitter-0<?php echo $i; ?>" <?php checked("twitter-0$i", $icon); ?>/><img src="<?php echo get_template_directory_uri(); ?>/images/twitter/twitter-0<?php echo $i; ?>.png" alt="Twitter 0<?php echo $i; ?>"/></span>
<?php
		}
?>
		</p>

		<p>
			<label for="<?php echo $this->get_field_id( 'icon_height' ); ?>"><?php _e('Set the height for the Twitter icon:', 'suffusion'); ?></label>
			<input id="<?php echo $this->get_field_id( 'icon_height' ); ?>" name="<?php echo $this->get_field_name( 'icon_height' ); ?>"
				value="<?php echo $instance['icon_height']; ?>"/>
			<br />
			<i><?php _e("Recommended sizes: 32px if the widget is being added to the \"Right Header Widgets\" area, whatever you like otherwise. Note that making the image too large will cause loss of picture quality.", "suffusion"); ?></i>
		</p>
	</div>
</div>
<?php
	}
}
?>
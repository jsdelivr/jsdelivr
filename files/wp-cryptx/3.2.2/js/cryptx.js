function DeCryptString( s )
{
	var n = 0;
	var r = "mailto:";
	for( var i = 0; i < s.length; i++)
	{
	    n = s.charCodeAt( i );
	    if( n >= 8364 )
	    {
		n = 128;
	    }
	    r += String.fromCharCode( n - 1 );
	}
	return r;
}

function DeCryptX( s )
{
	location.href=DeCryptString( s );
}
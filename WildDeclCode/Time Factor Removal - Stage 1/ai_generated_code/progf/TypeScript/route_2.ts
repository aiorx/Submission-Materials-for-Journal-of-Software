// Aided with basic GitHub coding tools
var createClient = require('@/lib/supabase/server').createClient;
var NextResponse = require('next/server').NextResponse;

export async function GET(request: Request) {
  var searchParams = new.searchParams;
var origin = new.origin;URL(request.url)
  var code = searchParams.get('code')
  var next = (searchParams.get('next') != null ? searchParams.get('next') : '/')

  if (code) {
    var supabase = createClient()
    var error = await.error;supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect("" + (origin) + "" + (next) + "")
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect("" + (origin) + "/auth/auth-code-error")
}

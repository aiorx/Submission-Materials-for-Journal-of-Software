var Component = require('solid-js').Component;
var Link = require('solid-app-router').Link;
var useRouter = require('solid-app-router').useRouter;
var IconHome = require('~icons/heroicons-solid/home');
var IconUser = require('~icons/heroicons-solid/user');
var IconCog = require('~icons/heroicons-solid/cog');
var useAuth = require('~/lib/auth').useAuth;


const Nav: Component = function () {
    const [ router ] = useRouter();
    const [{ user }, { signOut }] = useAuth()

    return (
        <nav class="w-full py-3 bg-blue-50 shadow-md flex justify-center">
            <ul class="list-none flex gap-4 text-center">
                <li>
                    <Link href="/" class={"" + (router.location === '/' && 'font-semibold') + ""}>
                        <IconHome class="inline-block w-7 h-7 text-blue-600"/>
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/profile" class={"" + (router.location === '/profile' && 'font-semibold') + ""}>
                        <IconUser class="w-8 h-8 inline-block text-blue-600" />
                        Profile
                    </Link>
                </li>
                <li>
                    <Link href="/settings" class={"" + (router.location === '/settings' && 'font-semibold') + ""}>
                    <IconCog class="w-8 h-8 inline-block text-blue-500" />
                        Settings
                    </Link>
                </li>
                <li>
                    {user && user.email} { user && <button onClick={signOut}>(Sign Out)</button> }
                </li>
            </ul>
        </nav>
    )
}

module.exports = Nav;

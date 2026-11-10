//          Copyright Odin Holmes 2016.
// Distributed under the Boost Software License, Version 1.0.
//     (See accompanying file LICENSE.md or copy at
//          http://www.boost.org/LICENSE_1_0.txt)
#pragma once

#include "../algorithm/find_if.hpp"
#include "../functional/bind.hpp"
#include "../functional/call.hpp"
#include "../functional/identity.hpp"
#include "../types/bool.hpp"

#include "../utility/always.hpp"
namespace kvasir {
	namespace mpl {
		namespace detail {
			template <typename F>
			struct not_ {
				template <typename T>
				typedef bool_<(!(F::template f<T>::value))> f;
			};
			template <template <typename...> class F>
			struct not_<cfe<F, identity>> {
				template <typename T>
				typedef bool_<(!F<T>::value)> f;
			};
		} // namespace detail
		/// \brief tests if a predicate holds for all elements in a pack
		/// \effects resolves to true_ if all elements in the input pack fulfill the provided
		/// predicate, otherwise false_. \requires Type `F` shall be a `continuation predicate` and
		/// C shall be any `continuation`. example: call<all<same_as<void>>,void,void,void> resolves
		/// to true_.
		template <typename F = identity, typename C = identity>
		typedef find_if<detail::not_<F>, always<bool_<false>, C>, always<bool_<true>, C>> all;
		namespace eager {
			/// resolves to true_ if all elements in the input list
			/// fulfill the provided predicate
			template <typename List, template <typename...> class Cond = identity>
			typedef call<unpack<mpl::all<cfe<Cond>>>, List> all;
		} // namespace eager
	} // namespace mpl
} // namespace kvasir

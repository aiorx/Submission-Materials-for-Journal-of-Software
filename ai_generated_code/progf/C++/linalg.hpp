#pragma once

#include <cstdint>

#include "mamath.hpp"
#include "optional.hpp"


namespace sung {

    template <typename T>
    class TVec2;
    template <typename T>
    class TVec3;
    template <typename T>
    class TVec4;


    template <typename T>
    class TVec2 {

    public:
        constexpr TVec2() : elements_{ 0, 0 } {}
        constexpr TVec2(T x, T y) : elements_{ x, y } {}

        // Element-wise operations
        constexpr TVec2 operator+(const TVec2& rhs) const {
            return TVec2{ this->x() + rhs.x(), this->y() + rhs.y() };
        }
        constexpr TVec2 operator-(const TVec2& rhs) const {
            return TVec2{ this->x() - rhs.x(), this->y() - rhs.y() };
        }
        constexpr TVec2 operator*(const TVec2& rhs) const {
            return TVec2{ this->x() * rhs.x(), this->y() * rhs.y() };
        }
        constexpr TVec2 operator/(const TVec2& rhs) const {
            return TVec2{ this->x() / rhs.x(), this->y() / rhs.y() };
        }

        constexpr TVec2& operator+=(const TVec2& rhs) {
            this->x() += rhs.x();
            this->y() += rhs.y();
            return *this;
        }
        constexpr TVec2& operator-=(const TVec2& rhs) {
            this->x() -= rhs.x();
            this->y() -= rhs.y();
            return *this;
        }

        // Scalar operations
        constexpr TVec2 operator*(T rhs) const {
            return TVec2{ this->x() * rhs, this->y() * rhs };
        }
        constexpr TVec2 operator/(T rhs) const {
            return TVec2{ this->x() / rhs, this->y() / rhs };
        }

        // Unary operations
        constexpr TVec2 operator-() const {
            return TVec2{ -this->x(), -this->y() };
        }

        constexpr T& operator[](size_t i) { return elements_[i]; }
        constexpr T operator[](size_t i) const { return elements_[i]; }

        constexpr T& x() { return elements_[0]; }
        constexpr T& y() { return elements_[1]; }

        constexpr T x() const { return elements_[0]; }
        constexpr T y() const { return elements_[1]; }

        constexpr bool are_similar(const TVec2& rhs, T epsilon = 0) const {
            return sung::are_similiar(this->x(), rhs.x(), epsilon) &&
                   sung::are_similiar(this->y(), rhs.y(), epsilon);
        }

        bool has_nan() const noexcept {
            return std::isnan(this->x()) || std::isnan(this->y());
        }

        bool has_inf() const noexcept {
            return std::isinf(this->x()) || std::isinf(this->y());
        }

        constexpr TVec2 lerp(const TVec2& rhs, T t) const {
            return *this + (rhs - *this) * t;
        }

        constexpr T dot(const TVec2& rhs) const {
            return (this->x() * rhs.x()) + (this->y() * rhs.y());
        }

        constexpr T cross(const TVec2& rhs) const {
            return (this->x() * rhs.y()) - (this->y() * rhs.x());
        }

        constexpr T len_sqr() const { return this->dot(*this); }

        T len() const { return std::sqrt(this->len_sqr()); }

        constexpr T distance_sqr(const TVec2& rhs) const {
            return (*this - rhs).len_sqr();
        }

        T distance(const TVec2& rhs) const { return (*this - rhs).len(); }

        TVec2 normalize() const {
            const auto l = this->len();
            return TVec2{ this->x() / l, this->y() / l };
        }

    private:
        T elements_[2];
    };


    template <typename T>
    class TVec3 {

    public:
        constexpr TVec3() : elements_{ 0, 0, 0 } {}
        constexpr TVec3(T x, T y, T z) : elements_{ x, y, z } {}

        template <typename U>
        constexpr TVec3(const TVec4<U>& other)
            : elements_{ other.x(), other.y(), other.z() } {}

        // Element-wise operations
        constexpr TVec3 operator+(const TVec3& rhs) const {
            return TVec3{ this->x() + rhs.x(),
                          this->y() + rhs.y(),
                          this->z() + rhs.z() };
        }
        constexpr TVec3 operator-(const TVec3& rhs) const {
            return TVec3{ this->x() - rhs.x(),
                          this->y() - rhs.y(),
                          this->z() - rhs.z() };
        }
        constexpr TVec3 operator*(const TVec3& rhs) const {
            return TVec3{ this->x() * rhs.x(),
                          this->y() * rhs.y(),
                          this->z() * rhs.z() };
        }
        constexpr TVec3 operator/(const TVec3& rhs) const {
            return TVec3{ this->x() / rhs.x(),
                          this->y() / rhs.y(),
                          this->z() / rhs.z() };
        }

        constexpr TVec3& operator+=(const TVec3& rhs) {
            this->x() += rhs.x();
            this->y() += rhs.y();
            this->z() += rhs.z();
            return *this;
        }
        constexpr TVec3& operator-=(const TVec3& rhs) {
            this->x() -= rhs.x();
            this->y() -= rhs.y();
            this->z() -= rhs.z();
            return *this;
        }

        // Scalar operations
        constexpr TVec3 operator*(T rhs) const {
            return TVec3{ this->x() * rhs, this->y() * rhs, this->z() * rhs };
        }
        constexpr TVec3 operator/(T rhs) const {
            return TVec3{ this->x() / rhs, this->y() / rhs, this->z() / rhs };
        }

        // Unary operations
        constexpr TVec3 operator-() const {
            return TVec3{ -this->x(), -this->y(), -this->z() };
        }

        constexpr T& operator[](size_t i) { return elements_[i]; }
        constexpr T operator[](size_t i) const { return elements_[i]; }

        constexpr T& x() { return elements_[0]; }
        constexpr T& y() { return elements_[1]; }
        constexpr T& z() { return elements_[2]; }

        constexpr T x() const { return elements_[0]; }
        constexpr T y() const { return elements_[1]; }
        constexpr T z() const { return elements_[2]; }

        constexpr bool are_similar(const TVec3& rhs, T epsilon = 0) const {
            return sung::are_similiar(this->x(), rhs.x(), epsilon) &&
                   sung::are_similiar(this->y(), rhs.y(), epsilon) &&
                   sung::are_similiar(this->z(), rhs.z(), epsilon);
        }

        bool has_nan() const noexcept {
            return std::isnan(this->x()) || std::isnan(this->y()) ||
                   std::isnan(this->z());
        }
        bool has_inf() const noexcept {
            return std::isinf(this->x()) || std::isinf(this->y()) ||
                   std::isinf(this->z());
        }

        constexpr TVec3 lerp(const TVec3& rhs, T t) const {
            return *this + (rhs - *this) * t;
        }

        constexpr T dot(const TVec3& rhs) const {
            return (this->x() * rhs.x()) + (this->y() * rhs.y()) +
                   (this->z() * rhs.z());
        }

        constexpr TVec3 cross(const TVec3& rhs) const {
            return TVec3{ (this->y() * rhs.z()) - (this->z() * rhs.y()),
                          (this->z() * rhs.x()) - (this->x() * rhs.z()),
                          (this->x() * rhs.y()) - (this->y() * rhs.x()) };
        }

        constexpr T len_sqr() const { return this->dot(*this); }

        T len() const { return std::sqrt(this->len_sqr()); }

        constexpr T distance_sqr(const TVec3& rhs) const {
            return (*this - rhs).len_sqr();
        }

        T distance(const TVec3& rhs) const { return (*this - rhs).len(); }

        TVec3 normalize() const {
            const auto l = this->len();
            return TVec3{ this->x() / l, this->y() / l, this->z() / l };
        }

    private:
        T elements_[3];
    };


    template <typename T>
    constexpr TVec3<T> operator*(T lhs, const TVec3<T>& rhs) {
        return rhs * lhs;
    }

    template <typename T>
    constexpr T length(const TVec3<T>& v) {
        return v.len();
    }

    template <typename T>
    constexpr T dot(const TVec3<T>& a, const TVec3<T>& b) {
        return a.dot(b);
    }

    template <typename T>
    constexpr TVec3<T> cross(const TVec3<T>& a, const TVec3<T>& b) {
        return a.cross(b);
    }

    template <typename T>
    constexpr TVec3<T> normalize(const TVec3<T>& v) {
        return v.normalize();
    }


    template <typename T>
    class TVec4 {

    public:
        constexpr TVec4() : elements_{ 0, 0, 0, 0 } {}
        constexpr TVec4(T x, T y, T z, T w) : elements_{ x, y, z, w } {}

        template <typename U, typename V>
        constexpr TVec4(const TVec3<U>& v, V w)
            : elements_{ static_cast<T>(v.x()),
                         static_cast<T>(v.y()),
                         static_cast<T>(v.z()),
                         static_cast<T>(w) } {}

        template <typename U>
        constexpr TVec4(const TVec4<U>& other)
            : elements_{ static_cast<T>(other.x()),
                         static_cast<T>(other.y()),
                         static_cast<T>(other.z()),
                         static_cast<T>(other.w()) } {}

        // Element-wise operations
        constexpr TVec4 operator+(const TVec4& rhs) const {
            return TVec4{ this->x() + rhs.x(),
                          this->y() + rhs.y(),
                          this->z() + rhs.z(),
                          this->w() + rhs.w() };
        }
        constexpr TVec4 operator-(const TVec4& rhs) const {
            return TVec4{ this->x() - rhs.x(),
                          this->y() - rhs.y(),
                          this->z() - rhs.z(),
                          this->w() - rhs.w() };
        }
        constexpr TVec4 operator*(const TVec4& rhs) const {
            return TVec4{ this->x() * rhs.x(),
                          this->y() * rhs.y(),
                          this->z() * rhs.z(),
                          this->w() * rhs.w() };
        }
        constexpr TVec4 operator/(const TVec4& rhs) const {
            return TVec4{ this->x() / rhs.x(),
                          this->y() / rhs.y(),
                          this->z() / rhs.z(),
                          this->w() / rhs.w() };
        }

        constexpr TVec4& operator+=(const TVec4& rhs) {
            this->x() += rhs.x();
            this->y() += rhs.y();
            this->z() += rhs.z();
            this->w() += rhs.w();
            return *this;
        }
        constexpr TVec4& operator-=(const TVec4& rhs) {
            this->x() -= rhs.x();
            this->y() -= rhs.y();
            this->z() -= rhs.z();
            this->w() -= rhs.w();
            return *this;
        }

        // Scalar operations
        constexpr TVec4 operator*(T rhs) const {
            return TVec4{ this->x() * rhs,
                          this->y() * rhs,
                          this->z() * rhs,
                          this->w() * rhs };
        }
        constexpr TVec4 operator/(T rhs) const {
            return TVec4{ this->x() / rhs,
                          this->y() / rhs,
                          this->z() / rhs,
                          this->w() / rhs };
        }

        // Unary operations
        constexpr TVec4 operator-() const {
            return TVec4{ -this->x(), -this->y(), -this->z(), -this->w() };
        }

        constexpr T& operator[](size_t i) { return elements_[i]; }
        constexpr T operator[](size_t i) const { return elements_[i]; }

        constexpr T& x() { return elements_[0]; }
        constexpr T& y() { return elements_[1]; }
        constexpr T& z() { return elements_[2]; }
        constexpr T& w() { return elements_[3]; }

        constexpr T x() const { return elements_[0]; }
        constexpr T y() const { return elements_[1]; }
        constexpr T z() const { return elements_[2]; }
        constexpr T w() const { return elements_[3]; }

        constexpr bool are_similar(const TVec4& rhs, T epsilon) const {
            return sung::are_similiar(this->x(), rhs.x(), epsilon) &&
                   sung::are_similiar(this->y(), rhs.y(), epsilon) &&
                   sung::are_similiar(this->z(), rhs.z(), epsilon) &&
                   sung::are_similiar(this->w(), rhs.w(), epsilon);
        }

        constexpr T dot(const TVec4& rhs) const {
            return (this->x() * rhs.x()) + (this->y() * rhs.y()) +
                   (this->z() * rhs.z()) + (this->w() * rhs.w());
        }

        constexpr T len_sqr() const { return this->dot(*this); }

        T len() const { return std::sqrt(this->len_sqr()); }

        constexpr T distance_sqr(const TVec4& rhs) const {
            return (*this - rhs).len_sqr();
        }

        T distance(const TVec4& rhs) const { return (*this - rhs).len(); }

        TVec4 normalize() const {
            const auto l = this->len();
            return TVec4{
                this->x() / l, this->y() / l, this->z() / l, this->w() / l
            };
        }

    private:
        T elements_[4];
    };


    template <typename T>
    class TMat3 {

    public:
        using Vec3 = TVec3<T>;

        constexpr TMat3() = default;

        constexpr TMat3(const Vec3& row0, const Vec3& row1, const Vec3& row2)
            : elements_{ row0, row1, row2 } {}

        constexpr static TMat3 identity() {
            TMat3 m;
            m.at(0, 0) = 1;
            m.at(1, 1) = 1;
            m.at(2, 2) = 1;
            return m;
        }

        static TMat3 rotate_axis(TVec3<T> axis, T angle) {
            axis = axis.normalize();

            const auto c = std::cos(angle);
            const auto s = std::sin(angle);
            const auto t = static_cast<T>(1) - c;
            const auto x = axis.x();
            const auto y = axis.y();
            const auto z = axis.z();

            TMat3 output;
            output.elements_[0][0] = t * x * x + c;
            output.elements_[0][1] = t * x * y - z * s;
            output.elements_[0][2] = t * x * z + y * s;

            output.elements_[1][0] = t * x * y + z * s;
            output.elements_[1][1] = t * y * y + c;
            output.elements_[1][2] = t * y * z - x * s;

            output.elements_[2][0] = t * x * z - y * s;
            output.elements_[2][1] = t * y * z + x * s;
            output.elements_[2][2] = t * z * z + c;
            return output;
        }

        constexpr T& at(size_t row, size_t col) { return elements_[row][col]; }
        constexpr T at(size_t row, size_t col) const {
            return elements_[row][col];
        }

        constexpr const Vec3& row(size_t r) const { return elements_[r]; }
        constexpr void set_row(size_t r, const Vec3& v) { elements_[r] = v; }
        constexpr void set_row(size_t r, T x, T y, T z) {
            elements_[r] = Vec3{ x, y, z };
        }

        constexpr Vec3 column(size_t c) const {
            return Vec3{ this->at(0, c), this->at(1, c), this->at(2, c) };
        }
        constexpr void set_column(size_t c, const Vec3& v) {
            this->at(0, c) = v.x();
            this->at(1, c) = v.y();
            this->at(2, c) = v.z();
        }
        constexpr void set_column(size_t c, T x, T y, T z) {
            this->at(0, c) = x;
            this->at(1, c) = y;
            this->at(2, c) = z;
        }

        constexpr bool are_similar(const TMat3& rhs, T epsilon = 0) const {
            return this->elements_[0].are_similar(rhs.elements_[0], epsilon) &&
                   this->elements_[1].are_similar(rhs.elements_[1], epsilon) &&
                   this->elements_[2].are_similar(rhs.elements_[2], epsilon);
        }

        constexpr double determinant() const {
            const auto& m = *this;
            return m.at(0, 0) *
                       (m.at(1, 1) * m.at(2, 2) - m.at(1, 2) * m.at(2, 1)) -
                   m.at(0, 1) *
                       (m.at(1, 0) * m.at(2, 2) - m.at(1, 2) * m.at(2, 0)) +
                   m.at(0, 2) *
                       (m.at(1, 0) * m.at(2, 1) - m.at(1, 1) * m.at(2, 0));
        }

        // This code was Supported via standard GitHub programming aids.
        // Do you trust AI?
        constexpr sung::Optional<TMat3> inverse() const {
            const auto det = this->determinant();
            if (sung::are_similiar<T>(det, 0, T{ 0 }))
                return sung::nullopt;

            TMat3 m = *this;
            const auto inv_det = 1.0 / det;
            m.at(0, 0) = (at(1, 1) * at(2, 2) - at(1, 2) * at(2, 1)) * inv_det;
            m.at(0, 1) = (at(0, 2) * at(2, 1) - at(0, 1) * at(2, 2)) * inv_det;
            m.at(0, 2) = (at(0, 1) * at(1, 2) - at(0, 2) * at(1, 1)) * inv_det;

            m.at(1, 0) = (at(1, 2) * at(2, 0) - at(1, 0) * at(2, 2)) * inv_det;
            m.at(1, 1) = (at(0, 0) * at(2, 2) - at(0, 2) * at(2, 0)) * inv_det;
            m.at(1, 2) = (at(1, 0) * at(0, 2) - at(0, 0) * at(1, 2)) * inv_det;

            m.at(2, 0) = (at(1, 0) * at(2, 1) - at(2, 0) * at(1, 1)) * inv_det;
            m.at(2, 1) = (at(2, 0) * at(0, 1) - at(0, 0) * at(2, 1)) * inv_det;
            m.at(2, 2) = (at(0, 0) * at(1, 1) - at(1, 0) * at(0, 1)) * inv_det;

            return m;
        }

    private:
        Vec3 elements_[3];
    };

    template <typename T>
    constexpr TMat3<T> operator*(const TMat3<T>& a, const TMat3<T>& b) {
        TMat3<T> result;
        for (size_t r = 0; r < 3; ++r) {
            for (size_t c = 0; c < 3; ++c) {
                result.at(r, c) = a.row(r).dot(b.column(c));
            }
        }
        return result;
    }

    template <typename T>
    constexpr TVec3<T> operator*(const TMat3<T>& m, const TVec3<T>& v) {
        return TVec3<T>{ m.row(0).dot(v), m.row(1).dot(v), m.row(2).dot(v) };
    }


    template <typename T>
    class TMat4 {

    public:
        using Vec3 = TVec3<T>;
        using Vec4 = TVec4<T>;

        constexpr TMat4() = default;

        constexpr TMat4(
            const Vec4& row0,
            const Vec4& row1,
            const Vec4& row2,
            const Vec4& row3
        )
            : elements_{ row0, row1, row2, row3 } {}

        constexpr static TMat4 identity() {
            TMat4 m;
            m.at(0, 0) = 1;
            m.at(1, 1) = 1;
            m.at(2, 2) = 1;
            m.at(3, 3) = 1;
            return m;
        }

        constexpr static TMat4 translate(T x, T y, T z) {
            auto m = TMat4::identity();
            m.at(0, 3) = x;
            m.at(1, 3) = y;
            m.at(2, 3) = z;
            return m;
        }

        constexpr static TMat4 translate(const Vec3& v) {
            auto m = TMat4::identity();
            m.at(0, 3) = v.x();
            m.at(1, 3) = v.y();
            m.at(2, 3) = v.z();
            return m;
        }

        static TMat4 rotate_axis(TVec3<T> axis, T angle) {
            axis = axis.normalize();

            const auto c = std::cos(angle);
            const auto s = std::sin(angle);
            const auto t = static_cast<T>(1) - c;
            const auto x = axis.x();
            const auto y = axis.y();
            const auto z = axis.z();

            TMat4 output;
            output.elements_[0][0] = t * x * x + c;
            output.elements_[0][1] = t * x * y - z * s;
            output.elements_[0][2] = t * x * z + y * s;

            output.elements_[1][0] = t * x * y + z * s;
            output.elements_[1][1] = t * y * y + c;
            output.elements_[1][2] = t * y * z - x * s;

            output.elements_[2][0] = t * x * z - y * s;
            output.elements_[2][1] = t * y * z + x * s;
            output.elements_[2][2] = t * z * z + c;

            output.elements_[3][3] = 1;
            return output;
        }

        constexpr T& at(size_t row, size_t col) { return elements_[row][col]; }
        constexpr T at(size_t row, size_t col) const {
            return elements_[row][col];
        }

        constexpr const Vec4& row(size_t r) const { return elements_[r]; }
        constexpr void set_row(size_t r, const Vec4& v) { elements_[r] = v; }
        constexpr void set_row(size_t r, T x, T y, T z, T w) {
            elements_[r] = Vec4{ x, y, z, w };
        }

        constexpr Vec4 column(size_t c) const {
            return Vec4{
                this->at(0, c), this->at(1, c), this->at(2, c), this->at(3, c)
            };
        }
        constexpr void set_column(size_t c, const Vec4& v) {
            this->at(0, c) = v.x();
            this->at(1, c) = v.y();
            this->at(2, c) = v.z();
            this->at(3, c) = v.w();
        }
        constexpr void set_column(size_t c, T x, T y, T z, T w) {
            this->at(0, c) = x;
            this->at(1, c) = y;
            this->at(2, c) = z;
            this->at(3, c) = w;
        }

        constexpr bool are_similar(const TMat4& rhs, T epsilon = 0) const {
            return this->elements_[0].are_similar(rhs.elements_[0], epsilon) &&
                   this->elements_[1].are_similar(rhs.elements_[1], epsilon) &&
                   this->elements_[2].are_similar(rhs.elements_[2], epsilon) &&
                   this->elements_[3].are_similar(rhs.elements_[3], epsilon);
        }

        constexpr sung::Optional<TMat4> inverse() const {
            static_assert(sizeof(TMat4) == sizeof(T) * 16, "");

            const auto m = reinterpret_cast<const T*>(this);
            T inv[16];

            inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] -
                     m[9] * m[6] * m[15] + m[9] * m[7] * m[14] +
                     m[13] * m[6] * m[11] - m[13] * m[7] * m[10];

            inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] +
                     m[8] * m[6] * m[15] - m[8] * m[7] * m[14] -
                     m[12] * m[6] * m[11] + m[12] * m[7] * m[10];

            inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] -
                     m[8] * m[5] * m[15] + m[8] * m[7] * m[13] +
                     m[12] * m[5] * m[11] - m[12] * m[7] * m[9];

            inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] +
                      m[8] * m[5] * m[14] - m[8] * m[6] * m[13] -
                      m[12] * m[5] * m[10] + m[12] * m[6] * m[9];

            inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] +
                     m[9] * m[2] * m[15] - m[9] * m[3] * m[14] -
                     m[13] * m[2] * m[11] + m[13] * m[3] * m[10];

            inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] -
                     m[8] * m[2] * m[15] + m[8] * m[3] * m[14] +
                     m[12] * m[2] * m[11] - m[12] * m[3] * m[10];

            inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] +
                     m[8] * m[1] * m[15] - m[8] * m[3] * m[13] -
                     m[12] * m[1] * m[11] + m[12] * m[3] * m[9];

            inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] -
                      m[8] * m[1] * m[14] + m[8] * m[2] * m[13] +
                      m[12] * m[1] * m[10] - m[12] * m[2] * m[9];

            inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] -
                     m[5] * m[2] * m[15] + m[5] * m[3] * m[14] +
                     m[13] * m[2] * m[7] - m[13] * m[3] * m[6];

            inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] +
                     m[4] * m[2] * m[15] - m[4] * m[3] * m[14] -
                     m[12] * m[2] * m[7] + m[12] * m[3] * m[6];

            inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] -
                      m[4] * m[1] * m[15] + m[4] * m[3] * m[13] +
                      m[12] * m[1] * m[7] - m[12] * m[3] * m[5];

            inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] +
                      m[4] * m[1] * m[14] - m[4] * m[2] * m[13] -
                      m[12] * m[1] * m[6] + m[12] * m[2] * m[5];

            inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] +
                     m[5] * m[2] * m[11] - m[5] * m[3] * m[10] -
                     m[9] * m[2] * m[7] + m[9] * m[3] * m[6];

            inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] -
                     m[4] * m[2] * m[11] + m[4] * m[3] * m[10] +
                     m[8] * m[2] * m[7] - m[8] * m[3] * m[6];

            inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] +
                      m[4] * m[1] * m[11] - m[4] * m[3] * m[9] -
                      m[8] * m[1] * m[7] + m[8] * m[3] * m[5];

            inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] -
                      m[4] * m[1] * m[10] + m[4] * m[2] * m[9] +
                      m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

            auto det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] +
                       m[3] * inv[12];
            if (det == 0)
                return sung::nullopt;
            det = 1.0 / det;

            TMat4 output;
            auto inv_out = reinterpret_cast<T*>(&output);
            for (int i = 0; i < 16; i++) inv_out[i] = inv[i] * det;

            return output;
        }

    private:
        Vec4 elements_[4];
    };

    static_assert(
        sizeof(TMat4<double>) == sizeof(double) * 16,
        "TMat4<double> must be as big as 4 doubles"
    );


    template <typename T>
    constexpr TMat4<T> operator*(const TMat4<T>& a, const TMat4<T>& b) {
        TMat4<T> result;
        for (size_t r = 0; r < 4; ++r) {
            for (size_t c = 0; c < 4; ++c) {
                result.at(r, c) = a.row(r).dot(b.column(c));
            }
        }
        return result;
    }

    template <typename T>
    constexpr TVec4<T> operator*(const TMat4<T>& m, const TVec4<T>& v) {
        return TVec4<T>{
            m.row(0).dot(v), m.row(1).dot(v), m.row(2).dot(v), m.row(3).dot(v)
        };
    }

}  // namespace sung

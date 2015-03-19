function _phpjs_shared_bc () {
  // http://kevin.vanzonneveld.net
  // +   original by: lmeyrick (https://sourceforge.net/projects/bcmath-js/)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: _phpjs_shared_bc();
  // *     returns 1: {}
  /**
   * BC Math Library for Javascript
   * Ported from the PHP5 bcmath extension source code,
   * which uses the libbcmath package...
   *    Copyright (C) 1991, 1992, 1993, 1994, 1997 Free Software Foundation, Inc.
   *    Copyright (C) 2000 Philip A. Nelson
   *     The Free Software Foundation, Inc.
   *     59 Temple Place, Suite 330
   *     Boston, MA 02111-1307 USA.
   *      e-mail:  philnelson@acm.org
   *     us-mail:  Philip A. Nelson
   *               Computer Science Department, 9062
   *               Western Washington University
   *               Bellingham, WA 98226-9062
   *
   * bcmath-js homepage:
   *
   * This code is covered under the LGPL licence, and can be used however you want :)
   * Be kind and share any decent code changes.
   */

  /**
   * Binary Calculator (BC) Arbitrary Precision Mathematics Lib v0.10  (LGPL)
   * Copy of libbcmath included in PHP5 src
   *
   * Note: this is just the shared library file and does not include the php-style functions.
   *       use bcmath{-min}.js for functions like bcadd, bcsub etc.
   *
   * Feel free to use how-ever you want, just email any bug-fixes/improvements to the sourceforge project:
   *
   *
   * Ported from the PHP5 bcmath extension source code,
   * which uses the libbcmath package...
   *    Copyright (C) 1991, 1992, 1993, 1994, 1997 Free Software Foundation, Inc.
   *    Copyright (C) 2000 Philip A. Nelson
   *     The Free Software Foundation, Inc.
   *     59 Temple Place, Suite 330
   *     Boston, MA 02111-1307 USA.
   *      e-mail:  philnelson@acm.org
   *     us-mail:  Philip A. Nelson
   *               Computer Science Department, 9062
   *               Western Washington University
   *               Bellingham, WA 98226-9062
   */

  var libbcmath = {
    PLUS: '+',
    MINUS: '-',
    BASE: 10,
    // must be 10 (for now)
    scale: 0,
    // default scale
    /**
     * Basic number structure
     */
    bc_num: function () {
      this.n_sign = null; // sign
      this.n_len = null; /* (int) The number of digits before the decimal point. */
      this.n_scale = null; /* (int) The number of digits after the decimal point. */
      //this.n_refs = null; /* (int) The number of pointers to this number. */
      //this.n_text = null; /* ?? Linked list for available list. */
      this.n_value = null; /* array as value, where 1.23 = [1,2,3] */
      this.toString = function () {
        var r, tmp;
        tmp = this.n_value.join('');

        // add minus sign (if applicable) then add the integer part
        r = ((this.n_sign == libbcmath.PLUS) ? '' : this.n_sign) + tmp.substr(0, this.n_len);

        // if decimal places, add a . and the decimal part
        if (this.n_scale > 0) {
          r += '.' + tmp.substr(this.n_len, this.n_scale);
        }
        return r;
      };
    },

    /**
     * Base add function
     *
     //  Here is the full add routine that takes care of negative numbers.
     //  N1 is added to N2 and the result placed into RESULT.  SCALE_MIN
     //  is the minimum scale for the result.
     *
     * @param {bc_num} n1
     * @param {bc_num} n2
     * @param {int} scale_min
     * @return bc_num
     */
    bc_add: function (n1, n2, scale_min) {
      var sum, cmp_res, res_scale;

      if (n1.n_sign === n2.n_sign) {
        sum = libbcmath._bc_do_add(n1, n2, scale_min);
        sum.n_sign = n1.n_sign;
      } else { /* subtraction must be done. */
        cmp_res = libbcmath._bc_do_compare(n1, n2, false, false); /* Compare magnitudes. */
        switch (cmp_res) {
        case -1:
          /* n1 is less than n2, subtract n1 from n2. */
          sum = libbcmath._bc_do_sub(n2, n1, scale_min);
          sum.n_sign = n2.n_sign;
          break;

        case 0:
          /* They are equal! return zero with the correct scale! */
          res_scale = libbcmath.MAX(scale_min, libbcmath.MAX(n1.n_scale, n2.n_scale));
          sum = libbcmath.bc_new_num(1, res_scale);
          libbcmath.memset(sum.n_value, 0, 0, res_scale + 1);
          break;

        case 1:
          /* n2 is less than n1, subtract n2 from n1. */
          sum = libbcmath._bc_do_sub(n1, n2, scale_min);
          sum.n_sign = n1.n_sign;
        }
      }
      return sum;
    },

    /**
     * This is the "user callable" routine to compare numbers N1 and N2.
     * @param {bc_num} n1
     * @param {bc_num} n2
     * @return int -1, 0, 1  (n1 < n2, ==, n1 > n2)
     */
    bc_compare: function (n1, n2) {
      return libbcmath._bc_do_compare(n1, n2, true, false);
    },

    _one_mult: function (num, n_ptr, size, digit, result, r_ptr) {
      var carry, value; // int
      var nptr, rptr; // int pointers
      if (digit === 0) {
        libbcmath.memset(result, 0, 0, size); //memset (result, 0, size);
      } else {
        if (digit == 1) {
          libbcmath.memcpy(result, r_ptr, num, n_ptr, size); //memcpy (result, num, size);
        } else { /*  Initialize */
          nptr = n_ptr + size - 1; //nptr = (unsigned char *) (num+size-1);
          rptr = r_ptr + size - 1; //rptr = (unsigned char *) (result+size-1);
          carry = 0;

          while (size-- > 0) {
            value = num[nptr--] * digit + carry; //value = *nptr-- * digit + carry;
            //result[rptr--] = libbcmath.cint(value % libbcmath.BASE); // @CHECK cint //*rptr-- = value % BASE;
            result[rptr--] = value % libbcmath.BASE; // @CHECK cint //*rptr-- = value % BASE;
            //carry = libbcmath.cint(value / libbcmath.BASE);   // @CHECK cint //carry = value / BASE;
            carry = Math.floor(value / libbcmath.BASE); // @CHECK cint //carry = value / BASE;
          }

          if (carry !== 0) {
            result[rptr] = carry;
          }
        }
      }
    },

    bc_divide: function (n1, n2, scale) {
      var quot; // bc_num return
      var qval; // bc_num
      var num1, num2; // string
      var ptr1, ptr2, n2ptr, qptr; // int pointers
      var scale1, val; // int
      var len1, len2, scale2, qdigits, extra, count; // int
      var qdig, qguess, borrow, carry; // int
      var mval; // string
      var zero; // char
      var norm; // int
      var ptrs; // return object from one_mul
      /* Test for divide by zero. (return failure) */
      if (libbcmath.bc_is_zero(n2)) {
        return -1;
      }

      /* Test for zero divide by anything (return zero) */
      if (libbcmath.bc_is_zero(n1)) {
        return libbcmath.bc_new_num(1, scale);
      }

/* Test for n1 equals n2 (return 1 as n1 nor n2 are zero)
  if (libbcmath.bc_compare(n1, n2, libbcmath.MAX(n1.n_scale, n2.n_scale)) === 0) {
    quot=libbcmath.bc_new_num(1, scale);
    quot.n_value[0] = 1;
    return quot;
  }
  */

      /* Test for divide by 1.  If it is we must truncate. */
      // todo: check where scale > 0 too.. can't see why not (ie bc_is_zero - add bc_is_one function)
      if (n2.n_scale === 0) {
        if (n2.n_len === 1 && n2.n_value[0] === 1) {
          qval = libbcmath.bc_new_num(n1.n_len, scale); //qval = bc_new_num (n1->n_len, scale);
          qval.n_sign = (n1.n_sign == n2.n_sign ? libbcmath.PLUS : libbcmath.MINUS);
          libbcmath.memset(qval.n_value, n1.n_len, 0, scale); //memset (&qval->n_value[n1->n_len],0,scale);
          libbcmath.memcpy(qval.n_value, 0, n1.n_value, 0, n1.n_len + libbcmath.MIN(n1.n_scale, scale)); //memcpy (qval->n_value, n1->n_value, n1->n_len + MIN(n1->n_scale,scale));
          // can we return here? not in c src, but can't see why-not.
          // return qval;
        }
      }

/* Set up the divide.  Move the decimal point on n1 by n2's scale.
   Remember, zeros on the end of num2 are wasted effort for dividing. */
      scale2 = n2.n_scale; //scale2 = n2->n_scale;
      n2ptr = n2.n_len + scale2 - 1; //n2ptr = (unsigned char *) n2.n_value+n2.n_len+scale2-1;
      while ((scale2 > 0) && (n2.n_value[n2ptr--] === 0)) {
        scale2--;
      }

      len1 = n1.n_len + scale2;
      scale1 = n1.n_scale - scale2;
      if (scale1 < scale) {
        extra = scale - scale1;
      } else {
        extra = 0;
      }

      num1 = libbcmath.safe_emalloc(1, n1.n_len + n1.n_scale, extra + 2); //num1 = (unsigned char *) safe_emalloc (1, n1.n_len+n1.n_scale, extra+2);
      if (num1 === null) {
        libbcmath.bc_out_of_memory();
      }
      libbcmath.memset(num1, 0, 0, n1.n_len + n1.n_scale + extra + 2); //memset (num1, 0, n1->n_len+n1->n_scale+extra+2);
      libbcmath.memcpy(num1, 1, n1.n_value, 0, n1.n_len + n1.n_scale); //memcpy (num1+1, n1.n_value, n1.n_len+n1.n_scale);
      len2 = n2.n_len + scale2; // len2 = n2->n_len + scale2;
      num2 = libbcmath.safe_emalloc(1, len2, 1); //num2 = (unsigned char *) safe_emalloc (1, len2, 1);
      if (num2 === null) {
        libbcmath.bc_out_of_memory();
      }
      libbcmath.memcpy(num2, 0, n2.n_value, 0, len2); //memcpy (num2, n2.n_value, len2);
      num2[len2] = 0; // *(num2+len2) = 0;
      n2ptr = 0; //n2ptr = num2;
      while (num2[n2ptr] === 0) { // while (*n2ptr == 0)
        n2ptr++;
        len2--;
      }

      /* Calculate the number of quotient digits. */
      if (len2 > len1 + scale) {
        qdigits = scale + 1;
        zero = true;
      } else {
        zero = false;
        if (len2 > len1) {
          qdigits = scale + 1; /* One for the zero integer part. */
        } else {
          qdigits = len1 - len2 + scale + 1;
        }
      }

      /* Allocate and zero the storage for the quotient. */
      qval = libbcmath.bc_new_num(qdigits - scale, scale); //qval = bc_new_num (qdigits-scale,scale);
      libbcmath.memset(qval.n_value, 0, 0, qdigits); //memset (qval->n_value, 0, qdigits);
      /* Allocate storage for the temporary storage mval. */
      mval = libbcmath.safe_emalloc(1, len2, 1); //mval = (unsigned char *) safe_emalloc (1, len2, 1);
      if (mval === null) {
        libbcmath.bc_out_of_memory();
      }

      /* Now for the full divide algorithm. */
      if (!zero) { /* Normalize */
        //norm = libbcmath.cint(10 / (libbcmath.cint(n2.n_value[n2ptr]) + 1)); //norm =  10 / ((int)*n2ptr + 1);
        norm = Math.floor(10 / (n2.n_value[n2ptr] + 1)); //norm =  10 / ((int)*n2ptr + 1);
        if (norm != 1) {
          libbcmath._one_mult(num1, 0, len1 + scale1 + extra + 1, norm, num1, 0); //libbcmath._one_mult(num1, len1+scale1+extra+1, norm, num1);
          libbcmath._one_mult(n2.n_value, n2ptr, len2, norm, n2.n_value, n2ptr); //libbcmath._one_mult(n2ptr, len2, norm, n2ptr);
          // @CHECK Is the pointer affected by the call? if so, maybe need to adjust points on return?
        }

        /* Initialize divide loop. */
        qdig = 0;
        if (len2 > len1) {
          qptr = len2 - len1; //qptr = (unsigned char *) qval.n_value+len2-len1;
        } else {
          qptr = 0; //qptr = (unsigned char *) qval.n_value;
        }

        /* Loop */
        while (qdig <= len1 + scale - len2) { /* Calculate the quotient digit guess. */
          if (n2.n_value[n2ptr] == num1[qdig]) {
            qguess = 9;
          } else {
            qguess = Math.floor((num1[qdig] * 10 + num1[qdig + 1]) / n2.n_value[n2ptr]);
          } /* Test qguess. */

          if (n2.n_value[n2ptr + 1] * qguess > (num1[qdig] * 10 + num1[qdig + 1] - n2.n_value[n2ptr] * qguess) * 10 + num1[qdig + 2]) { //if (n2ptr[1]*qguess > (num1[qdig]*10 + num1[qdig+1] - *n2ptr*qguess)*10 + num1[qdig+2]) {
            qguess--; /* And again. */
            if (n2.n_value[n2ptr + 1] * qguess > (num1[qdig] * 10 + num1[qdig + 1] - n2.n_value[n2ptr] * qguess) * 10 + num1[qdig + 2]) { //if (n2ptr[1]*qguess > (num1[qdig]*10 + num1[qdig+1] - *n2ptr*qguess)*10 + num1[qdig+2])
              qguess--;
            }
          }

          /* Multiply and subtract. */
          borrow = 0;
          if (qguess !== 0) {
            mval[0] = 0; //*mval = 0; // @CHECK is this to fix ptr2 < 0?
            libbcmath._one_mult(n2.n_value, n2ptr, len2, qguess, mval, 1); //_one_mult (n2ptr, len2, qguess, mval+1); // @CHECK
            ptr1 = qdig + len2; //(unsigned char *) num1+qdig+len2;
            ptr2 = len2; //(unsigned char *) mval+len2;
            // @CHECK: Does a negative pointer return null?
            //         ptr2 can be < 0 here as ptr1 = len2, thus count < len2+1 will always fail ?
            for (count = 0; count < len2 + 1; count++) {
              if (ptr2 < 0) {
                //val = libbcmath.cint(num1[ptr1]) - 0 - borrow;    //val = (int) *ptr1 - (int) *ptr2-- - borrow;
                val = num1[ptr1] - 0 - borrow; //val = (int) *ptr1 - (int) *ptr2-- - borrow;
              } else {
                //val = libbcmath.cint(num1[ptr1]) - libbcmath.cint(mval[ptr2--]) - borrow;    //val = (int) *ptr1 - (int) *ptr2-- - borrow;
                val = num1[ptr1] - mval[ptr2--] - borrow; //val = (int) *ptr1 - (int) *ptr2-- - borrow;
              }
              if (val < 0) {
                val += 10;
                borrow = 1;
              } else {
                borrow = 0;
              }
              num1[ptr1--] = val;
            }
          }

          /* Test for negative result. */
          if (borrow == 1) {
            qguess--;
            ptr1 = qdig + len2; //(unsigned char *) num1+qdig+len2;
            ptr2 = len2 - 1; //(unsigned char *) n2ptr+len2-1;
            carry = 0;
            for (count = 0; count < len2; count++) {
              if (ptr2 < 0) {
                //val = libbcmath.cint(num1[ptr1]) + 0 + carry; //val = (int) *ptr1 + (int) *ptr2-- + carry;
                val = num1[ptr1] + 0 + carry; //val = (int) *ptr1 + (int) *ptr2-- + carry;
              } else {
                //val = libbcmath.cint(num1[ptr1]) + libbcmath.cint(n2.n_value[ptr2--]) + carry; //val = (int) *ptr1 + (int) *ptr2-- + carry;
                val = num1[ptr1] + n2.n_value[ptr2--] + carry; //val = (int) *ptr1 + (int) *ptr2-- + carry;
              }
              if (val > 9) {
                val -= 10;
                carry = 1;
              } else {
                carry = 0;
              }
              num1[ptr1--] = val; //*ptr1-- = val;
            }
            if (carry == 1) {
              //num1[ptr1] = libbcmath.cint((num1[ptr1] + 1) % 10);  // *ptr1 = (*ptr1 + 1) % 10; // @CHECK
              num1[ptr1] = (num1[ptr1] + 1) % 10; // *ptr1 = (*ptr1 + 1) % 10; // @CHECK
            }
          }

          /* We now know the quotient digit. */
          qval.n_value[qptr++] = qguess; //*qptr++ =  qguess;
          qdig++;
        }
      }

      /* Clean up and return the number. */
      qval.n_sign = (n1.n_sign == n2.n_sign ? libbcmath.PLUS : libbcmath.MINUS);
      if (libbcmath.bc_is_zero(qval)) {
        qval.n_sign = libbcmath.PLUS;
      }
      libbcmath._bc_rm_leading_zeros(qval);

      return qval;

      //return 0;    /* Everything is OK. */
    },



    MUL_BASE_DIGITS: 80,
    MUL_SMALL_DIGITS: (this.MUL_BASE_DIGITS / 4),
    //#define MUL_SMALL_DIGITS mul_base_digits/4

/* The multiply routine.  N2 times N1 is put int PROD with the scale of
   the result being MIN(N2 scale+N1 scale, MAX (SCALE, N2 scale, N1 scale)).
   */
    /**
     * @param n1 bc_num
     * @param n2 bc_num
     * @param scale [int] optional
     */
    bc_multiply: function (n1, n2, scale) {
      var pval; // bc_num
      var len1, len2; // int
      var full_scale, prod_scale; // int
      // Initialize things.
      len1 = n1.n_len + n1.n_scale;
      len2 = n2.n_len + n2.n_scale;
      full_scale = n1.n_scale + n2.n_scale;
      prod_scale = libbcmath.MIN(full_scale, libbcmath.MAX(scale, libbcmath.MAX(n1.n_scale, n2.n_scale)));

      //pval = libbcmath.bc_init_num(); // allow pass by ref
      // Do the multiply
      pval = libbcmath._bc_rec_mul(n1, len1, n2, len2, full_scale);

      // Assign to prod and clean up the number.
      pval.n_sign = (n1.n_sign == n2.n_sign ? libbcmath.PLUS : libbcmath.MINUS);
      //pval.n_value = pval.n_ptr; // @FIX
      pval.n_len = len2 + len1 + 1 - full_scale;
      pval.n_scale = prod_scale;
      libbcmath._bc_rm_leading_zeros(pval);
      if (libbcmath.bc_is_zero(pval)) {
        pval.n_sign = libbcmath.PLUS;
      }
      //bc_free_num (prod);
      return pval;
    },

    new_sub_num: function (length, scale, value) {
      var temp = new libbcmath.bc_num();
      temp.n_sign = libbcmath.PLUS;
      temp.n_len = length;
      temp.n_scale = scale;
      temp.n_value = value;
      return temp;
    },

    _bc_simp_mul: function (n1, n1len, n2, n2len, full_scale) {
      var prod; // bc_num
      var n1ptr, n2ptr, pvptr; // char *n1ptr, *n2ptr, *pvptr;
      var n1end, n2end; //char *n1end, *n2end;        /* To the end of n1 and n2. */
      var indx, sum, prodlen; //int indx, sum, prodlen;
      prodlen = n1len + n2len + 1;

      prod = libbcmath.bc_new_num(prodlen, 0);

      n1end = n1len - 1; //(char *) (n1->n_value + n1len - 1);
      n2end = n2len - 1; //(char *) (n2->n_value + n2len - 1);
      pvptr = prodlen - 1; //(char *) ((*prod)->n_value + prodlen - 1);
      sum = 0;

      // Here is the loop...
      for (indx = 0; indx < prodlen - 1; indx++) {
        n1ptr = n1end - libbcmath.MAX(0, indx - n2len + 1); //(char *) (n1end - MAX(0, indx-n2len+1));
        n2ptr = n2end - libbcmath.MIN(indx, n2len - 1); //(char *) (n2end - MIN(indx, n2len-1));
        while ((n1ptr >= 0) && (n2ptr <= n2end)) {
          sum += n1.n_value[n1ptr--] * n2.n_value[n2ptr++]; //sum += *n1ptr-- * *n2ptr++;
        }
        prod.n_value[pvptr--] = Math.floor(sum % libbcmath.BASE); //*pvptr-- = sum % BASE;
        sum = Math.floor(sum / libbcmath.BASE); //sum = sum / BASE;
      }
      prod.n_value[pvptr] = sum; //*pvptr = sum;
      return prod;
    },


/* A special adder/subtractor for the recursive divide and conquer
       multiply algorithm.  Note: if sub is called, accum must
       be larger that what is being subtracted.  Also, accum and val
       must have n_scale = 0.  (e.g. they must look like integers. *) */
    _bc_shift_addsub: function (accum, val, shift, sub) {
      var accp, valp; //signed char *accp, *valp;
      var count, carry; //int  count, carry;
      count = val.n_len;
      if (val.n_value[0] === 0) {
        count--;
      }

      //assert (accum->n_len+accum->n_scale >= shift+count);
      if (accum.n_len + accum.n_scale < shift + count) {
        throw new Error("len + scale < shift + count"); // ?? I think that's what assert does :)
      }


      // Set up pointers and others
      accp = accum.n_len + accum.n_scale - shift - 1; // (signed char *)(accum->n_value + accum->n_len + accum->n_scale - shift - 1);
      valp = val.n_len = 1; //(signed char *)(val->n_value + val->n_len - 1);
      carry = 0;
      if (sub) {
        // Subtraction, carry is really borrow.
        while (count--) {
          accum.n_value[accp] -= val.n_value[valp--] + carry; //*accp -= *valp-- + carry;
          if (accum.n_value[accp] < 0) { //if (*accp < 0)
            carry = 1;
            accum.n_value[accp--] += libbcmath.BASE; //*accp-- += BASE;
          } else {
            carry = 0;
            accp--;
          }
        }
        while (carry) {
          accum.n_value[accp] -= carry; //*accp -= carry;
          if (accum.n_value[accp] < 0) { //if (*accp < 0)
            accum.n_value[accp--] += libbcmath.BASE; //    *accp-- += BASE;
          } else {
            carry = 0;
          }
        }
      } else {
        // Addition
        while (count--) {
          accum.n_value[accp] += val.n_value[valp--] + carry; //*accp += *valp-- + carry;
          if (accum.n_value[accp] > (libbcmath.BASE - 1)) { //if (*accp > (BASE-1))
            carry = 1;
            accum.n_value[accp--] -= libbcmath.BASE; //*accp-- -= BASE;
          } else {
            carry = 0;
            accp--;
          }
        }
        while (carry) {
          accum.n_value[accp] += carry; //*accp += carry;
          if (accum.n_value[accp] > (libbcmath.BASE - 1)) { //if (*accp > (BASE-1))
            accum.n_value[accp--] -= libbcmath.BASE; //*accp-- -= BASE;
          } else {
            carry = 0;
          }
        }
      }
      return true; // accum is the pass-by-reference return
    },

/* Recursive divide and conquer multiply algorithm.
       Based on
       Let u = u0 + u1*(b^n)
       Let v = v0 + v1*(b^n)
       Then uv = (B^2n+B^n)*u1*v1 + B^n*(u1-u0)*(v0-v1) + (B^n+1)*u0*v0

       B is the base of storage, number of digits in u1,u0 close to equal.
    */
    _bc_rec_mul: function (u, ulen, v, vlen, full_scale) {
      var prod; // @return
      var u0, u1, v0, v1; //bc_num
      var u0len, v0len; //int
      var m1, m2, m3, d1, d2; //bc_num
      var n, prodlen, m1zero; // int
      var d1len, d2len; // int
      // Base case?
      if ((ulen + vlen) < libbcmath.MUL_BASE_DIGITS || ulen < libbcmath.MUL_SMALL_DIGITS || vlen < libbcmath.MUL_SMALL_DIGITS) {
        return libbcmath._bc_simp_mul(u, ulen, v, vlen, full_scale);
      }

      // Calculate n -- the u and v split point in digits.
      n = Math.floor((libbcmath.MAX(ulen, vlen) + 1) / 2);

      // Split u and v.
      if (ulen < n) {
        u1 = libbcmath.bc_init_num(); //u1 = bc_copy_num (BCG(_zero_));
        u0 = libbcmath.new_sub_num(ulen, 0, u.n_value);
      } else {
        u1 = libbcmath.new_sub_num(ulen - n, 0, u.n_value);
        u0 = libbcmath.new_sub_num(n, 0, u.n_value + ulen - n);
      }
      if (vlen < n) {
        v1 = libbcmath.bc_init_num(); //bc_copy_num (BCG(_zero_));
        v0 = libbcmath.new_sub_num(vlen, 0, v.n_value);
      } else {
        v1 = libbcmath.new_sub_num(vlen - n, 0, v.n_value);
        v0 = libbcmath.new_sub_num(n, 0, v.n_value + vlen - n);
      }
      libbcmath._bc_rm_leading_zeros(u1);
      libbcmath._bc_rm_leading_zeros(u0);
      u0len = u0.n_len;
      libbcmath._bc_rm_leading_zeros(v1);
      libbcmath._bc_rm_leading_zeros(v0);
      v0len = v0.n_len;

      m1zero = libbcmath.bc_is_zero(u1) || libbcmath.bc_is_zero(v1);

      // Calculate sub results ...
      d1 = libbcmath.bc_init_num(); // needed?
      d2 = libbcmath.bc_init_num(); // needed?
      d1 = libbcmath.bc_sub(u1, u0, 0);
      d1len = d1.n_len;

      d2 = libbcmath.bc_sub(v0, v1, 0);
      d2len = d2.n_len;

      // Do recursive multiplies and shifted adds.
      if (m1zero) {
        m1 = libbcmath.bc_init_num(); //bc_copy_num (BCG(_zero_));
      } else {
        //m1 = libbcmath.bc_init_num(); //allow pass-by-ref
        m1 = libbcmath._bc_rec_mul(u1, u1.n_len, v1, v1.n_len, 0);
      }
      if (libbcmath.bc_is_zero(d1) || libbcmath.bc_is_zero(d2)) {
        m2 = libbcmath.bc_init_num(); //bc_copy_num (BCG(_zero_));
      } else {
        //m2 = libbcmath.bc_init_num(); //allow pass-by-ref
        m2 = libbcmath._bc_rec_mul(d1, d1len, d2, d2len, 0);
      }

      if (libbcmath.bc_is_zero(u0) || libbcmath.bc_is_zero(v0)) {
        m3 = libbcmath.bc_init_num(); //bc_copy_num (BCG(_zero_));
      } else {
        //m3 = libbcmath.bc_init_num(); //allow pass-by-ref
        m3 = libbcmath._bc_rec_mul(u0, u0.n_len, v0, v0.n_len, 0);
      }

      // Initialize product
      prodlen = ulen + vlen + 1;
      prod = libbcmath.bc_new_num(prodlen, 0);

      if (!m1zero) {
        libbcmath._bc_shift_addsub(prod, m1, 2 * n, 0);
        libbcmath._bc_shift_addsub(prod, m1, n, 0);
      }
      libbcmath._bc_shift_addsub(prod, m3, n, 0);
      libbcmath._bc_shift_addsub(prod, m3, 0, 0);
      libbcmath._bc_shift_addsub(prod, m2, n, d1.n_sign != d2.n_sign);

      return prod;
      // Now clean up!
      //bc_free_num (&u1);
      //bc_free_num (&u0);
      //bc_free_num (&v1);
      //bc_free_num (&m1);
      //bc_free_num (&v0);
      //bc_free_num (&m2);
      //bc_free_num (&m3);
      //bc_free_num (&d1);
      //bc_free_num (&d2);
    },


    /**
     *
     * @param {bc_num} n1
     * @param {bc_num} n2
     * @param {boolean} use_sign
     * @param {boolean} ignore_last
     * @return -1, 0, 1 (see bc_compare)
     */
    _bc_do_compare: function (n1, n2, use_sign, ignore_last) {
      var n1ptr, n2ptr; // int
      var count; // int
      /* First, compare signs. */
      if (use_sign && (n1.n_sign != n2.n_sign)) {
        if (n1.n_sign == libbcmath.PLUS) {
          return (1); /* Positive N1 > Negative N2 */
        } else {
          return (-1); /* Negative N1 < Positive N1 */
        }
      }

      /* Now compare the magnitude. */
      if (n1.n_len != n2.n_len) {
        if (n1.n_len > n2.n_len) { /* Magnitude of n1 > n2. */
          if (!use_sign || (n1.n_sign == libbcmath.PLUS)) {
            return (1);
          } else {
            return (-1);
          }
        } else { /* Magnitude of n1 < n2. */
          if (!use_sign || (n1.n_sign == libbcmath.PLUS)) {
            return (-1);
          } else {
            return (1);
          }
        }
      }

/* If we get here, they have the same number of integer digits.
     check the integer part and the equal length part of the fraction. */
      count = n1.n_len + Math.min(n1.n_scale, n2.n_scale);
      n1ptr = 0;
      n2ptr = 0;

      while ((count > 0) && (n1.n_value[n1ptr] == n2.n_value[n2ptr])) {
        n1ptr++;
        n2ptr++;
        count--;
      }

      if (ignore_last && (count == 1) && (n1.n_scale == n2.n_scale)) {
        return (0);
      }

      if (count !== 0) {
        if (n1.n_value[n1ptr] > n2.n_value[n2ptr]) { /* Magnitude of n1 > n2. */
          if (!use_sign || n1.n_sign == libbcmath.PLUS) {
            return (1);
          } else {
            return (-1);
          }
        } else { /* Magnitude of n1 < n2. */
          if (!use_sign || n1.n_sign == libbcmath.PLUS) {
            return (-1);
          } else {
            return (1);
          }
        }
      }

      /* They are equal up to the last part of the equal part of the fraction. */
      if (n1.n_scale != n2.n_scale) {
        if (n1.n_scale > n2.n_scale) {
          for (count = (n1.n_scale - n2.n_scale); count > 0; count--) {
            if (n1.n_value[n1ptr++] !== 0) { /* Magnitude of n1 > n2. */
              if (!use_sign || n1.n_sign == libbcmath.PLUS) {
                return (1);
              } else {
                return (-1);
              }
            }
          }
        } else {
          for (count = (n2.n_scale - n1.n_scale); count > 0; count--) {
            if (n2.n_value[n2ptr++] !== 0) { /* Magnitude of n1 < n2. */
              if (!use_sign || n1.n_sign == libbcmath.PLUS) {
                return (-1);
              } else {
                return (1);
              }
            }
          }
        }
      }

      /* They must be equal! */
      return (0);
    },



/* Here is the full subtract routine that takes care of negative numbers.
   N2 is subtracted from N1 and the result placed in RESULT.  SCALE_MIN
   is the minimum scale for the result. */
    bc_sub: function (n1, n2, scale_min) {
      var diff; // bc_num
      var cmp_res, res_scale; //int
      if (n1.n_sign != n2.n_sign) {
        diff = libbcmath._bc_do_add(n1, n2, scale_min);
        diff.n_sign = n1.n_sign;
      } else { /* subtraction must be done. */
        /* Compare magnitudes. */
        cmp_res = libbcmath._bc_do_compare(n1, n2, false, false);
        switch (cmp_res) {
        case -1:
          /* n1 is less than n2, subtract n1 from n2. */
          diff = libbcmath._bc_do_sub(n2, n1, scale_min);
          diff.n_sign = (n2.n_sign == libbcmath.PLUS ? libbcmath.MINUS : libbcmath.PLUS);
          break;
        case 0:
          /* They are equal! return zero! */
          res_scale = libbcmath.MAX(scale_min, libbcmath.MAX(n1.n_scale, n2.n_scale));
          diff = libbcmath.bc_new_num(1, res_scale);
          libbcmath.memset(diff.n_value, 0, 0, res_scale + 1);
          break;
        case 1:
          /* n2 is less than n1, subtract n2 from n1. */
          diff = libbcmath._bc_do_sub(n1, n2, scale_min);
          diff.n_sign = n1.n_sign;
          break;
        }
      }

      /* Clean up and return. */
      //bc_free_num (result);
      //*result = diff;
      return diff;
    },


    _bc_do_add: function (n1, n2, scale_min) {
      var sum; // bc_num
      var sum_scale, sum_digits; // int
      var n1ptr, n2ptr, sumptr; // int
      var carry, n1bytes, n2bytes; // int
      var tmp; // int

      // Prepare sum.
      sum_scale = libbcmath.MAX(n1.n_scale, n2.n_scale);
      sum_digits = libbcmath.MAX(n1.n_len, n2.n_len) + 1;
      sum = libbcmath.bc_new_num(sum_digits, libbcmath.MAX(sum_scale, scale_min));


/* Not needed?
    if (scale_min > sum_scale) {
      sumptr = (char *) (sum->n_value + sum_scale + sum_digits);
      for (count = scale_min - sum_scale; count > 0; count--) {
        *sumptr++ = 0;
      }
    }
    */

      // Start with the fraction part.  Initialize the pointers.
      n1bytes = n1.n_scale;
      n2bytes = n2.n_scale;
      n1ptr = (n1.n_len + n1bytes - 1);
      n2ptr = (n2.n_len + n2bytes - 1);
      sumptr = (sum_scale + sum_digits - 1);

      // Add the fraction part.  First copy the longer fraction (ie when adding 1.2345 to 1 we know .2345 is correct already) .
      if (n1bytes != n2bytes) {
        if (n1bytes > n2bytes) {
          // n1 has more dp then n2
          while (n1bytes > n2bytes) {
            sum.n_value[sumptr--] = n1.n_value[n1ptr--];
            // *sumptr-- = *n1ptr--;
            n1bytes--;
          }
        } else {
          // n2 has more dp then n1
          while (n2bytes > n1bytes) {
            sum.n_value[sumptr--] = n2.n_value[n2ptr--];
            // *sumptr-- = *n2ptr--;
            n2bytes--;
          }
        }
      }

      // Now add the remaining fraction part and equal size integer parts.
      n1bytes += n1.n_len;
      n2bytes += n2.n_len;
      carry = 0;
      while ((n1bytes > 0) && (n2bytes > 0)) {

        // add the two numbers together
        tmp = n1.n_value[n1ptr--] + n2.n_value[n2ptr--] + carry;
        // *sumptr = *n1ptr-- + *n2ptr-- + carry;
        // check if they are >= 10 (impossible to be more then 18)
        if (tmp >= libbcmath.BASE) {
          carry = 1;
          tmp -= libbcmath.BASE; // yep, subtract 10, add a carry
        } else {
          carry = 0;
        }
        sum.n_value[sumptr] = tmp;
        sumptr--;
        n1bytes--;
        n2bytes--;
      }

      // Now add carry the [rest of the] longer integer part.
      if (n1bytes === 0) {
        // n2 is a bigger number then n1
        while (n2bytes-- > 0) {
          tmp = n2.n_value[n2ptr--] + carry;
          // *sumptr = *n2ptr-- + carry;
          if (tmp >= libbcmath.BASE) {
            carry = 1;
            tmp -= libbcmath.BASE;
          } else {
            carry = 0;
          }
          sum.n_value[sumptr--] = tmp;
        }
      } else {
        // n1 is bigger then n2..
        while (n1bytes-- > 0) {
          tmp = n1.n_value[n1ptr--] + carry;
          // *sumptr = *n1ptr-- + carry;
          if (tmp >= libbcmath.BASE) {
            carry = 1;
            tmp -= libbcmath.BASE;
          } else {
            carry = 0;
          }
          sum.n_value[sumptr--] = tmp;
        }
      }

      // Set final carry.
      if (carry == 1) {
        sum.n_value[sumptr] += 1;
        // *sumptr += 1;
      }

      // Adjust sum and return.
      libbcmath._bc_rm_leading_zeros(sum);
      return sum;
    },

    /**
     * Perform a subtraction
     *
     // Perform subtraction: N2 is subtracted from N1 and the value is
     //  returned.  The signs of N1 and N2 are ignored.  Also, N1 is
     //  assumed to be larger than N2.  SCALE_MIN is the minimum scale
     //  of the result.
     *
     * Basic school maths says to subtract 2 numbers..
     * 1. make them the same length, the decimal places, and the integer part
     * 2. start from the right and subtract the two numbers from each other
     * 3. if the sum of the 2 numbers < 0, carry -1 to the next set and add 10 (ie 18 > carry 1 becomes 8). thus 0.9 + 0.9 = 1.8
     *
     * @param {bc_num} n1
     * @param {bc_num} n2
     * @param {int} scale_min
     * @return bc_num
     */
    _bc_do_sub: function (n1, n2, scale_min) {
      var diff; //bc_num
      var diff_scale, diff_len; // int
      var min_scale, min_len; // int
      var n1ptr, n2ptr, diffptr; // int
      var borrow, count, val; // int
      // Allocate temporary storage.
      diff_len = libbcmath.MAX(n1.n_len, n2.n_len);
      diff_scale = libbcmath.MAX(n1.n_scale, n2.n_scale);
      min_len = libbcmath.MIN(n1.n_len, n2.n_len);
      min_scale = libbcmath.MIN(n1.n_scale, n2.n_scale);
      diff = libbcmath.bc_new_num(diff_len, libbcmath.MAX(diff_scale, scale_min));

/* Not needed?
    // Zero extra digits made by scale_min.
    if (scale_min > diff_scale) {
      diffptr = (char *) (diff->n_value + diff_len + diff_scale);
      for (count = scale_min - diff_scale; count > 0; count--) {
        *diffptr++ = 0;
      }
    }
    */

      // Initialize the subtract.
      n1ptr = (n1.n_len + n1.n_scale - 1);
      n2ptr = (n2.n_len + n2.n_scale - 1);
      diffptr = (diff_len + diff_scale - 1);

      // Subtract the numbers.
      borrow = 0;

      // Take care of the longer scaled number.
      if (n1.n_scale != min_scale) {
        // n1 has the longer scale
        for (count = n1.n_scale - min_scale; count > 0; count--) {
          diff.n_value[diffptr--] = n1.n_value[n1ptr--];
          // *diffptr-- = *n1ptr--;
        }
      } else {
        // n2 has the longer scale
        for (count = n2.n_scale - min_scale; count > 0; count--) {
          val = 0 - n2.n_value[n2ptr--] - borrow;
          //val = - *n2ptr-- - borrow;
          if (val < 0) {
            val += libbcmath.BASE;
            borrow = 1;
          } else {
            borrow = 0;
          }
          diff.n_value[diffptr--] = val;
          //*diffptr-- = val;
        }
      }

      // Now do the equal length scale and integer parts.
      for (count = 0; count < min_len + min_scale; count++) {
        val = n1.n_value[n1ptr--] - n2.n_value[n2ptr--] - borrow;
        //val = *n1ptr-- - *n2ptr-- - borrow;
        if (val < 0) {
          val += libbcmath.BASE;
          borrow = 1;
        } else {
          borrow = 0;
        }
        diff.n_value[diffptr--] = val;
        //*diffptr-- = val;
      }

      // If n1 has more digits then n2, we now do that subtract.
      if (diff_len != min_len) {
        for (count = diff_len - min_len; count > 0; count--) {
          val = n1.n_value[n1ptr--] - borrow;
          // val = *n1ptr-- - borrow;
          if (val < 0) {
            val += libbcmath.BASE;
            borrow = 1;
          } else {
            borrow = 0;
          }
          diff.n_value[diffptr--] = val;
        }
      }

      // Clean up and return.
      libbcmath._bc_rm_leading_zeros(diff);
      return diff;
    },

    /**
     *
     * @param {int} length
     * @param {int} scale
     * @return bc_num
     */
    bc_new_num: function (length, scale) {
      var temp; // bc_num
      temp = new libbcmath.bc_num();
      temp.n_sign = libbcmath.PLUS;
      temp.n_len = length;
      temp.n_scale = scale;
      temp.n_value = libbcmath.safe_emalloc(1, length + scale, 0);
      libbcmath.memset(temp.n_value, 0, 0, length + scale);
      return temp;
    },

    safe_emalloc: function (size, len, extra) {
      return Array((size * len) + extra);
    },

    /**
     * Create a new number
     */
    bc_init_num: function () {
      return new libbcmath.bc_new_num(1, 0);

    },

    _bc_rm_leading_zeros: function (num) { /* We can move n_value to point to the first non zero digit! */
      while ((num.n_value[0] === 0) && (num.n_len > 1)) {
        num.n_value.shift();
        num.n_len--;
      }
    },

    /**
     * Convert to bc_num detecting scale
     */
    php_str2num: function (str) {
      var p;
      p = str.indexOf('.');
      if (p == -1) {
        return libbcmath.bc_str2num(str, 0);
      } else {
        return libbcmath.bc_str2num(str, (str.length - p));
      }

    },

    CH_VAL: function (c) {
      return c - '0'; //??
    },

    BCD_CHAR: function (d) {
      return d + '0'; // ??
    },

    isdigit: function (c) {
      return (isNaN(parseInt(c, 10)) ? false : true);
    },

    bc_str2num: function (str_in, scale) {
      var str, num, ptr, digits, strscale, zero_int, nptr;
      // remove any non-expected characters
      /* Check for valid number and count digits. */

      str = str_in.split(''); // convert to array
      ptr = 0; // str
      digits = 0;
      strscale = 0;
      zero_int = false;
      if ((str[ptr] === '+') || (str[ptr] === '-')) {
        ptr++; /* Sign */
      }
      while (str[ptr] === '0') {
        ptr++; /* Skip leading zeros. */
      }
      //while (libbcmath.isdigit(str[ptr])) {
      while ((str[ptr]) % 1 === 0) { //libbcmath.isdigit(str[ptr])) {
        ptr++;
        digits++; /* digits */
      }

      if (str[ptr] === '.') {
        ptr++; /* decimal point */
      }
      //while (libbcmath.isdigit(str[ptr])) {
      while ((str[ptr]) % 1 === 0) { //libbcmath.isdigit(str[ptr])) {
        ptr++;
        strscale++; /* digits */
      }

      if ((str[ptr]) || (digits + strscale === 0)) {
        // invalid number, return 0
        return libbcmath.bc_init_num();
        //*num = bc_copy_num (BCG(_zero_));
      }

      /* Adjust numbers and allocate storage and initialize fields. */
      strscale = libbcmath.MIN(strscale, scale);
      if (digits === 0) {
        zero_int = true;
        digits = 1;
      }

      num = libbcmath.bc_new_num(digits, strscale);

      /* Build the whole number. */
      ptr = 0; // str
      if (str[ptr] === '-') {
        num.n_sign = libbcmath.MINUS;
        //(*num)->n_sign = MINUS;
        ptr++;
      } else {
        num.n_sign = libbcmath.PLUS;
        //(*num)->n_sign = PLUS;
        if (str[ptr] === '+') {
          ptr++;
        }
      }
      while (str[ptr] === '0') {
        ptr++; /* Skip leading zeros. */
      }

      nptr = 0; //(*num)->n_value;
      if (zero_int) {
        num.n_value[nptr++] = 0;
        digits = 0;
      }
      for (; digits > 0; digits--) {
        num.n_value[nptr++] = libbcmath.CH_VAL(str[ptr++]);
        //*nptr++ = CH_VAL(*ptr++);
      }

      /* Build the fractional part. */
      if (strscale > 0) {
        ptr++; /* skip the decimal point! */
        for (; strscale > 0; strscale--) {
          num.n_value[nptr++] = libbcmath.CH_VAL(str[ptr++]);
        }
      }

      return num;
    },

    cint: function (v) {
      if (typeof v === 'undefined') {
        v = 0;
      }
      var x = parseInt(v, 10);
      if (isNaN(x)) {
        x = 0;
      }
      return x;
    },

    /**
     * Basic min function
     * @param {int} a
     * @param {int} b
     */
    MIN: function (a, b) {
      return ((a > b) ? b : a);
    },

    /**
     * Basic max function
     * @param {int} a
     * @param {int} b
     */
    MAX: function (a, b) {
      return ((a > b) ? a : b);
    },

    /**
     * Basic odd function
     * @param {int} a
     */
    ODD: function (a) {
      return (a & 1);
    },

    /**
     * replicate c function
     * @param {array} r     return (by reference)
     * @param {int} ptr
     * @param {string} chr    char to fill
     * @param {int} len       length to fill
     */
    memset: function (r, ptr, chr, len) {
      var i;
      for (i = 0; i < len; i++) {
        r[ptr + i] = chr;
      }
    },

    /**
     * Replacement c function
     * Obviously can't work like c does, so we've added an "offset" param so you could do memcpy(dest+1, src, len) as memcpy(dest, 1, src, len)
     * Also only works on arrays
     */
    memcpy: function (dest, ptr, src, srcptr, len) {
      var i;
      for (i = 0; i < len; i++) {
        dest[ptr + i] = src[srcptr + i];
      }
      return true;
    },


    /**
     * Determine if the number specified is zero or not
     * @param {bc_num} num    number to check
     * @return boolean      true when zero, false when not zero.
     */
    bc_is_zero: function (num) {
      var count; // int
      var nptr; // int
      /* Quick check. */
      //if (num == BCG(_zero_)) return TRUE;
      /* Initialize */
      count = num.n_len + num.n_scale;
      nptr = 0; //num->n_value;
      /* The check */
      while ((count > 0) && (num.n_value[nptr++] === 0)) {
        count--;
      }

      if (count !== 0) {
        return false;
      } else {
        return true;
      }
    },

    bc_out_of_memory: function () {
      throw new Error("(BC) Out of memory");
    }
  };
  return libbcmath;
}

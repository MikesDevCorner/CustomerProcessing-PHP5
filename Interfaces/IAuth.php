<?php

interface IAuth {

	public function authenticate(IDbConnection $db, IRequest $request);
        public function authorize();
}
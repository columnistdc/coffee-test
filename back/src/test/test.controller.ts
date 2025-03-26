import { Controller, Get, Post, Body } from "@nestjs/common";

interface TestRequestBody {
  [key: string]: unknown;
}

@Controller("api/test")
export class TestController {
  @Get()
  getTest() {
    console.log("[api/test] GET request received");
    return {
      message: "Hello!",
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  postTest(@Body() body: TestRequestBody) {
    console.log("[api/test] POST request received", body);
    return {
      message: "Data received",
      receivedData: body,
      timestamp: new Date().toISOString(),
    };
  }
}

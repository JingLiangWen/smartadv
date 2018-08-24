//
//  RNFTPKit.m
//  SCRMAPP
//
//  Created by wenjl on 2018/7/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "RNFTPKit.h"


NSString *const FTPDownloadEventProgress = @"FTPDownloadProgress";

@interface RNFTPKit()
//@property (nonatomic, strong) FTPClient *ftp;
@property (nonatomic, strong) LxFTPRequest *request;
@property (nonatomic, copy) NSMutableData *dataToDownload;
@property (nonatomic, assign) long long downloadSize;
@property (nonatomic, copy) NSString *distPath;
@property (nonatomic, copy) RCTPromiseResolveBlock finishCallBack;
@property (nonatomic, assign) CGFloat progress;


@end

@implementation RNFTPKit

RCT_EXPORT_MODULE()

//- (dispatch_queue_t)methodQueue
//{
//  return dispatch_get_main_queue();
//}

- (NSArray<NSString *> *)supportedEvents
{
  return @[FTPDownloadEventProgress];
}

RCT_REMAP_METHOD(download,
                 body:(NSDictionary *)body
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    NSString *username = body[@"username"];
    NSString *password = body[@"password"];
    NSString *host = body[@"host"];
    
    NSString *downloadFilePath = body[@"downloadFilePath"];
    if (downloadFilePath.length > 0) {
      downloadFilePath = [downloadFilePath stringByReplacingOccurrencesOfString:@"\\" withString:@"/"];
    }
    NSString *distPath = body[@"distPath"];
    if (distPath.length > 0) {
      distPath = [distPath stringByReplacingOccurrencesOfString:@"\\" withString:@"/"];
    }
    
    NSString *fileName = [downloadFilePath lastPathComponent];
    distPath = [distPath stringByAppendingPathComponent:fileName];
    self.distPath = distPath;
    self.finishCallBack = resolve;
    self.progress = 0;
    typeof(self) __weak weakSelf = self;
    LxFTPRequest *request = [LxFTPRequest downloadRequest];
    self.request = request;
    
    
    /*>>>>>>>>>>>
     NSString *urlstr = [NSString stringWithFormat:@"ftp://%@:%@@%@%@",username, password, host,downloadFilePath];
     NSURL *url = [NSURL URLWithString:urlstr];
     NSString * utente = username;
     NSString * codice = password;
     NSURLProtectionSpace * protectionSpace = [[NSURLProtectionSpace alloc] initWithHost:url.host port:[url.port integerValue] protocol:url.scheme realm:nil authenticationMethod:nil];
     
     NSURLCredential *cred = [NSURLCredential
     credentialWithUser:utente
     password:codice
     persistence:NSURLCredentialPersistenceForSession];
     
     
     NSURLCredentialStorage * cred_storage ;
     [cred_storage setCredential:cred forProtectionSpace:protectionSpace];
     
     NSURLSessionConfiguration *sessionConfiguration = [NSURLSessionConfiguration defaultSessionConfiguration];
     sessionConfiguration.URLCredentialStorage = cred_storage;
     sessionConfiguration.allowsCellularAccess = YES;
     
     NSURLSession *session = [NSURLSession sessionWithConfiguration:sessionConfiguration delegate:self delegateQueue:nil];
     NSLog(@"viewdidload");
     
     NSURLSessionDownloadTask *downloadTask = [session downloadTaskWithURL:url];
     [downloadTask resume];
     <<<<<<<<<<*/
    
    // >>>>>>>>>>>>>>>
    //    NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
    //    NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: self delegateQueue: [NSOperationQueue mainQueue]];
    //
    //
    //    NSURLSession *session = [NSURLSession sharedSession];
    //    NSString *url = [NSString stringWithFormat:@"ftp://%@:%@@%@%@",username, password, host,downloadFilePath];
    //
    //    NSURLSessionDataTask *dataTask = [defaultSession dataTaskWithURL: [NSURL URLWithString:url]];
    //    [dataTask resume];
    
    
    
    //    NSURLSessionDownloadTask *downloadTask = [session downloadTaskWithURL:[NSURL URLWithString:url] completionHandler:^(NSURL *location, NSURLResponse *response, NSError *error) {
    //      //app內Documents的路徑
    //      NSString *document = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    //      //response.suggestedFilename: 下載目標的檔案名稱(image.jpg)
    //      NSString *file = [document stringByAppendingPathComponent:response.suggestedFilename];
    //      NSFileManager *fileManager = [NSFileManager defaultManager];
    //      //從下載暫存區(tmp)移動至Documents
    //      [fileManager moveItemAtPath:location.path toPath:distPath error:nil];
    //      NSLog(@"[DownloadTask]success!");
    //      resolve(distPath);
    //    }];
    //    [downloadTask resume];
    // <<<<<<<<<<<<<<<<<<<<<
    
    // >>>>>>>>>>>>>>>
    //    request.serverURL = [[NSURL URLWithString:[NSString stringWithFormat:@"ftp://%@",host]] URLByAppendingPathComponent:downloadFilePath];
    //    request.localFileURL = [NSURL fileURLWithPath:distPath];
    //    request.username = username;
    //    request.password = password;
    //
    //    request.progressAction = ^(NSInteger totalSize, NSInteger finishedSize, CGFloat finishedPercent) {
    //      NSLog(@"totalSize = %ld, finishedSize = %ld, finishedPercent = %f", totalSize, finishedSize, finishedPercent); //
    //      totalSize = MAX(totalSize, finishedSize);
    //      typeof(weakSelf) __strong strongSelf = weakSelf;
    //      NSLog(@"进度%lf",(CGFloat)finishedSize / (CGFloat)totalSize);
    //      NSMutableDictionary *body = [[NSMutableDictionary alloc] init];
    //      [body setObject:[NSNumber numberWithFloat:(CGFloat)finishedSize / (CGFloat)totalSize] forKey:@"progress"];
    //      ;
    //
    //
    //      NSString *progressStr = [[NSNumber numberWithFloat:(CGFloat)finishedSize / (CGFloat)totalSize] stringValue];
    //      [strongSelf sendEventWithName:FTPDownloadEventProgress body:progressStr];
    //    };
    //    request.successAction = ^(Class resultClass, id result) {
    //      NSLog(@"成功");
    //      resolve(result);
    //    };
    //    request.failAction = ^(CFStreamErrorDomain domain, NSInteger error, NSString *errorMessage) {
    //      NSLog(@"失败");
    //      reject(@"FTP", errorMessage, nil);
    //    };
    //    dispatch_async(dispatch_get_main_queue(), ^(void){
    //      [request start];
    //    });
    
    
    
    //    self.ftp = [FTPClient clientWithHost:@"172.26.136.167" port:21 username:@"DocManage" password:@"abc123!!"];
    //    [self.ftp downloadFile:downloadFilePath to:distPath progress:NULL success:^(void) {
    //      NSLog(@"Success 002");
    //    } failure:^(NSError *error) {
    //      NSLog(@"Error: %@", error.localizedDescription);
    //    }];
    
    
    
    // session的代理是只读的,所以只能创建的时候设置
    NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration] delegate:self delegateQueue:[[NSOperationQueue alloc] init]];
    
    // 创建任务
    NSURLSessionDownloadTask *task = [session downloadTaskWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"ftp://%@:%@@%@%@",username, password, host,downloadFilePath]]];
    
    // 启动任务
    [task resume];
    
    
  });
  
  
}

#pragma mark - NSURLSessionDownloadDelegate

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error
{
  NSLog(@"%s",__func__);
  
  if (error) {
    NSLog(@"请求失败");
  } else{
    NSLog(@"请求完成, 数据接收完毕");
  }
}

/**
 *  每当写入数据到临时文件时,就会调用一次(会调用多次)
 *  @param bytesWritten              这次写入的大小
 *  @param totalBytesWritten         已经写入的总大小
 *  @param totalBytesExpectedToWrite 总大小
 */
- (void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didWriteData:(int64_t)bytesWritten totalBytesWritten:(int64_t)totalBytesWritten totalBytesExpectedToWrite:(int64_t)totalBytesExpectedToWrite
{
  NSLog(@"------%f", 1.0 * totalBytesWritten / totalBytesExpectedToWrite);
  CGFloat progress= 1.0 * totalBytesWritten / totalBytesExpectedToWrite;
  NSString *progressStr = [[NSNumber numberWithFloat:progress] stringValue];
  NSLog(@"%@",progressStr);
  if (progress  >= (self.progress + 0.1)) {
    self.progress = progress;
    [self sendEventWithName:FTPDownloadEventProgress body:progressStr];
    
  }
//
}

/**
 *  下载完毕会调用一次这个方法
 */
- (void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didFinishDownloadingToURL:(NSURL *)location
{
  // 文件将来存放的地址
  // suggestedFilename 服务器中的文件名
  NSString *file = [[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) lastObject] stringByAppendingPathComponent:downloadTask.response.suggestedFilename];
  
  // 剪切location路径下的临时文件到以后文件存放的地址
  NSFileManager *mgr = [NSFileManager defaultManager];
  [mgr moveItemAtURL:location toURL:[NSURL fileURLWithPath:self.distPath] error:nil];
  self.finishCallBack(self.distPath);
}



@end

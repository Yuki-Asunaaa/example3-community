from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse, json
from application.service import analyze
ROOT = Path(__file__).resolve().parents[1]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8767)
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--data', type=Path, default=ROOT/'data/case3.json')
    args = parser.parse_args()
    result = analyze(args.data)
    payload = json.dumps(result, ensure_ascii=False).encode()
    (ROOT/'output').mkdir(exist_ok=True)
    (ROOT/'output/analysis.json').write_bytes(payload)
    (ROOT/'frontend/analysis.json').write_bytes(payload)
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self,*a,**kw):
            super().__init__(*a,directory=str(ROOT/'frontend'),**kw)
        def do_GET(self):
            if self.path.split('?')[0] == '/api/analysis':
                self.send_response(200); self.send_header('Content-Type','application/json; charset=utf-8')
                self.send_header('Content-Length',str(len(payload))); self.end_headers(); self.wfile.write(payload)
            else:
                super().do_GET()
    print(f'网络社区实验室：http://{args.host}:{args.port}', flush=True)
    ThreadingHTTPServer((args.host,args.port),Handler).serve_forever()

if __name__ == '__main__':
    main()

pid = spawn("grunt")
Process.wait(pid)
spawn("electron .")